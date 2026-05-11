from pydantic import BaseModel
from typing import Optional


class TaskBase(BaseModel):
    title: str
    description: str


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "todo"


class TaskResponse(TaskBase):
    id: int
    status: str
    created_at: str

    class Config:
        from_attributes = True