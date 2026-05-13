from sqlalchemy import Column, String, ForeignKey, UUID, Table
import uuid
from app.db.base_class import Base, TimestampMixin
from sqlalchemy.orm import relationship

workspace_members = Table(
    "workspace_members",
    Base.metadata,
    Column("workspace_id", UUID(as_uuid=True), ForeignKey("workspaces.id"), primary_key=True),
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
)

class Workspace(Base, TimestampMixin):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User", backref="owned_workspaces")
    members = relationship("User", secondary=workspace_members, backref="workspaces")

class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    
    workspace = relationship("Workspace", backref="projects")
