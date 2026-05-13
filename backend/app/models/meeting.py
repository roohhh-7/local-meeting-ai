from sqlalchemy import Column, String, ForeignKey, UUID, Integer, Enum, Text, JSON
import uuid
import enum
from app.db.base_class import Base, TimestampMixin
from sqlalchemy.orm import relationship

class MeetingStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Meeting(Base, TimestampMixin):
    __tablename__ = "meetings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    status = Column(Enum(MeetingStatus), default=MeetingStatus.PENDING)
    duration = Column(Integer, nullable=True) # in seconds
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    
    workspace = relationship("Workspace", backref="meetings")
    project = relationship("Project", backref="meetings")

class Transcript(Base, TimestampMixin):
    __tablename__ = "transcripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey("meetings.id"), unique=True, nullable=False)
    raw_text = Column(Text, nullable=False)
    segments = Column(JSON, nullable=True) # Speaker segments with timestamps
    
    meeting = relationship("Meeting", backref="transcript")

class AISummary(Base, TimestampMixin):
    __tablename__ = "ai_summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey("meetings.id"), unique=True, nullable=False)
    summary = Column(Text, nullable=False)
    key_points = Column(JSON, nullable=True)
    action_items = Column(JSON, nullable=True)
    
    meeting = relationship("Meeting", backref="summary")

class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey("meetings.id"), nullable=False)
    title = Column(String, nullable=False)
    assignee = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="todo")
    
    meeting = relationship("Meeting", backref="tasks")
