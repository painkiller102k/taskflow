from sqlalchemy import Column, Integer, String, Text, Enum, TIMESTAMP, text
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum("todo", "in_progress", "done"), default="todo")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))