from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models, schemas
from database import SessionLocal, engine
from logger import log_event

# =========================
# DB INIT
# =========================

models.Base.metadata.create_all(bind=engine)

# =========================
# APP
# =========================

app = FastAPI(title="TaskFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DB DEPENDENCY
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    log_event("INFO", "Root endpoint called")
    return {
        "message": "TaskFlow API is running",
        "status": "ok"
    }

# =========================
# GET TASKS
# =========================

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()

    log_event(
        "INFO",
        "Fetched all tasks",
        metadata={"count": len(tasks)}
    )

    return tasks

# =========================
# CREATE TASK
# =========================

@app.post("/tasks")
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        status="todo"
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    log_event(
        "INFO",
        "Task created",
        metadata={
            "task_id": new_task.id,
            "title": new_task.title
        }
    )

    return new_task

# =========================
# UPDATE TASK
# =========================

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not db_task:
        log_event("WARNING", "Task not found for update", metadata={"task_id": task_id})
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status

    db.commit()
    db.refresh(db_task)

    log_event(
        "INFO",
        "Task updated",
        metadata={"task_id": task_id}
    )

    return db_task

# =========================
# DELETE TASK
# =========================

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not db_task:
        log_event("WARNING", "Task not found for delete", metadata={"task_id": task_id})
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()

    log_event(
        "INFO",
        "Task deleted",
        metadata={"task_id": task_id}
    )

    return {
        "message": "deleted",
        "task_id": task_id
    }