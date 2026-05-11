import React from "react";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div className={`task-card ${task.status === "done" ? "done" : ""}`}>
      
      {/* checkbox */}
      <button
        className={`check-btn ${task.status === "done" ? "checked" : ""}`}
        onClick={() => onToggle(task)}
      >
        {task.status === "done" && "✓"}
      </button>

      {/* body */}
      <div className="task-body">
        <div className="task-title">{task.title}</div>

        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}

        <div className="task-meta">
          <span
            className={`badge-status ${
              task.status === "done" ? "badge-done" : "badge-todo"
            }`}
          >
            {task.status}
          </span>

          <span className="task-date">
            {task.created_at
              ? new Date(task.created_at).toLocaleString()
              : ""}
          </span>
        </div>
      </div>

      {/* delete */}
      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        🗑
      </button>
    </div>
  );
}