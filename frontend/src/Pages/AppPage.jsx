import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API    = "http://localhost:8000/tasks";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(str) {
  const d = new Date(str);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5l2.5 2.5 5-5" stroke="white"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 15 15">
      <path d="M7.5 2v11M2 7.5h11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M6 4V3h4v1M5 4l.5 8h5L11 4"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="6" y="8" width="32" height="28" rx="4"
          stroke="#1e293b" strokeWidth="2"/>
        <path d="M13 18h18M13 24h12" stroke="#1e293b"
          strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p>No tasks here yet</p>
    </div>
  );
}

export default function AppPage() {
  const [tasks,       setTasks]       = useState([]);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [filter,      setFilter]      = useState("all");
  const [loading,     setLoading]     = useState(true);

  const fetchTasks = async () => {
    try {
      const res  = await fetch(API);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await fetch(API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (e) {
      console.error("Failed to add task:", e);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  };

  const toggleStatus = async (task) => {
    const next = task.status === "todo" ? "done" : "todo";
    try {
      await fetch(`${API}/${task.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...task, status: next }),
      });
      fetchTasks();
    } catch (e) {
      console.error("Failed to update task:", e);
    }
  };

  const handleTitleKey = (e) => {
    if (e.key === "Enter") document.getElementById("inp-desc").focus();
  };

  const handleDescKey = (e) => {
    if (e.key === "Enter") addTask();
  };

  const visible   = tasks.filter(t => filter === "all" || t.status === filter);
  const doneCount = tasks.filter(t => t.status === "done").length;
  const progress  = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  // Update global progress bar
  useEffect(() => {
    const el = document.getElementById("global-prog");
    if (el) el.style.width = `${progress}%`;
  }, [progress]);

  return (
    <div className="app-shell page-enter">
      {/* Header */}
      <div className="app-header">
        <h2>My tasks</h2>
        <div className="stat-pills">
          <div className="stat-pill">Total <b>{tasks.length}</b></div>
          <div className="stat-pill">Done <b>{doneCount}</b></div>
        </div>
      </div>

      {/* Add form */}
      <div className="add-card">
        <div className="add-inputs">
          <input
            className="tf-input"
            placeholder="Task title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleTitleKey}
            maxLength={80}
            autoFocus
          />
          <input
            id="inp-desc"
            className="tf-input"
            placeholder="Description (optional)..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={handleDescKey}
            maxLength={160}
          />
        </div>
        <button className="add-btn" onClick={addTask}>
          <PlusIcon /> Add task
        </button>
      </div>

      {/* Filters */}
      <div className="section-label">Tasks</div>
      <div className="filters">
        {[
          { key: "all",  label: "All"         },
          { key: "todo", label: "In progress" },
          { key: "done", label: "Done"        },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="task-list">
        {loading && (
          <p style={{ color: "#334155", textAlign: "center", padding: "32px 0" }}>
            Loading…
          </p>
        )}

        {!loading && visible.length === 0 && <EmptyState />}

        <AnimatePresence>
          {visible.map(task => (
            <motion.div
              key={task.id}
              className={`task-card ${task.status === "done" ? "done" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{ opacity: 0, x: -16   }}
              transition={{ duration: 0.18 }}
            >
              <button
                className={`check-btn ${task.status === "done" ? "checked" : ""}`}
                onClick={() => toggleStatus(task)}
                aria-label="Toggle status"
              >
                {task.status === "done" && <CheckIcon />}
              </button>

              <div className="task-body">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
                <div className="task-meta">
                  <span className={`badge-status ${task.status === "done" ? "badge-done" : "badge-todo"}`}>
                    {task.status === "done" ? "Done" : "In progress"}
                  </span>
                  {task.created_at && (
                    <span className="task-date">{formatDate(task.created_at)}</span>
                  )}
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                <TrashIcon />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}