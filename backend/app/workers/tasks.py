from celery import Celery
from app.core.config import settings
from app.ai.transcriber import transcriber
from app.ai.ollama_client import ollama_client
from app.ai.vector_store import vector_store
from app.db.session import SessionLocal
from app.models.meeting import Meeting, MeetingStatus, Transcript, AISummary
import json

import app.models

celery_app = Celery("tasks", broker=settings.REDIS_URL)

@celery_app.task(name="process_meeting")
def process_meeting_task(meeting_id: str):
    db = SessionLocal()
    meeting = None
    try:
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            return "Meeting not found"
        
        meeting.status = MeetingStatus.PROCESSING
        db.commit()
        
        # 1. Transcribe
        transcription_result = transcriber.transcribe(meeting.file_path)
        raw_text = transcription_result.get("text", "")
        
        # Check if transcript already exists
        transcript = db.query(Transcript).filter(Transcript.meeting_id == meeting.id).first()
        if transcript:
            transcript.raw_text = raw_text
            transcript.segments = transcription_result.get("segments", [])
        else:
            transcript = Transcript(
                meeting_id=meeting.id,
                raw_text=raw_text,
                segments=transcription_result.get("segments", [])
            )
            db.add(transcript)
        db.commit()
        
        # 2. Summarize
        import asyncio
        loop = asyncio.get_event_loop()
        summary_json_str = loop.run_until_complete(ollama_client.generate_summary(raw_text))
        
        # Robust extraction from JSON string
        try:
            # Look for the first { and last }
            start = summary_json_str.find('{')
            end = summary_json_str.rfind('}')
            if start != -1 and end != -1:
                json_content = summary_json_str[start:end+1]
                summary_data = json.loads(json_content)
            else:
                summary_data = json.loads(summary_json_str)
        except Exception as e:
            print(f"Failed to parse AI summary: {str(e)}")
            summary_data = {"summary": summary_json_str, "key_points": [], "action_items": []}
            
        # Check if summary already exists
        summary_obj = db.query(AISummary).filter(AISummary.meeting_id == meeting.id).first()
        if summary_obj:
            summary_obj.summary = summary_data.get("summary", "")
            summary_obj.key_points = summary_data.get("key_points", [])
            summary_obj.action_items = summary_data.get("action_items", [])
        else:
            summary_obj = AISummary(
                meeting_id=meeting.id,
                summary=summary_data.get("summary", ""),
                key_points=summary_data.get("key_points", []),
                action_items=summary_data.get("action_items", [])
            )
            db.add(summary_obj)
        db.commit()
        
        # 3. Vectorize chunks
        # Simple chunking for now
        chunks = [raw_text[i:i+1000] for i in range(0, len(raw_text), 800)]
        metadata = [{"chunk_index": i} for i in range(len(chunks))]
        vector_store.add_chunks(str(meeting.id), chunks, metadata)
        
        meeting.status = MeetingStatus.COMPLETED
        db.commit()
        
        return "Processing completed"
    except Exception as e:
        if meeting:
            meeting.status = MeetingStatus.FAILED
            db.commit()
        return f"Processing failed: {str(e)}"
    finally:
        db.close()
