from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.meeting import Task
from typing import List

router = APIRouter()

@router.get("/")
def list_tasks(meeting_id: str = None, db: Session = Depends(get_db)):
    query = db.query(Task)
    if meeting_id:
        query = query.filter(Task.meeting_id == meeting_id)
    return query.all()

@router.patch("/{task_id}")
def update_task(task_id: str, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    db.refresh(task)
    return task
