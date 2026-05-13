from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.meeting import Meeting, MeetingStatus
from app.models.workspace import Workspace
from app.models.user import User
from app.workers.tasks import process_meeting_task
import os
from app.core.config import settings
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_meeting(
    file: UploadFile = File(...),
    title: str = Form(...),
    workspace_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Ensure upload directory exists
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)
        
    if not workspace_id:
        workspace = db.query(Workspace).first()
        if not workspace:
            user = db.query(User).first()
            if not user:
                raise HTTPException(status_code=400, detail="No user found to assign workspace")
            workspace = Workspace(name="Default Workspace", owner_id=user.id)
            db.add(workspace)
            db.commit()
            db.refresh(workspace)
        workspace_id = str(workspace.id)
        
    file_extension = file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    meeting = Meeting(
        title=title,
        file_path=file_path,
        workspace_id=workspace_id,
        status=MeetingStatus.PENDING
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # Trigger background processing
    process_meeting_task.delay(str(meeting.id))
    
    return meeting

@router.get("/{meeting_id}")
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Manually build response to include relationships
    return {
        "id": str(meeting.id),
        "title": meeting.title,
        "status": meeting.status,
        "created_at": meeting.created_at,
        "duration": meeting.duration,
        "transcript": {
            "raw_text": meeting.transcript[0].raw_text,
            "segments": meeting.transcript[0].segments
        } if meeting.transcript else None,
        "ai_summary": {
            "summary": meeting.summary[0].summary,
            "key_points": meeting.summary[0].key_points,
            "action_items": meeting.summary[0].action_items
        } if meeting.summary else None
    }

@router.get("/")
def list_meetings(workspace_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Meeting)
    if workspace_id:
        query = query.filter(Meeting.workspace_id == workspace_id)
    return query.all()
