import { motion } from "framer-motion";

const FEATURES = [
  { icon: "📋", title: "Full CRUD", desc: "Create, read, update and delete tasks backed by a clean REST API." },
  { icon: "✅", title: "Status tracking", desc: "Toggle tasks between todo and done with one click on any card." },
  { icon: "🔍", title: "Filter & focus", desc: "Filter by All, In progress, or Done — always see what matters." },
  { icon: "📊", title: "ELK monitoring", desc: "Every event logs as structured JSON and appears live in Kibana." },
];

const STACK = {
  Frontend: [
    { name: "React", color: "#61dafb" },
    { name: "Vite", color: "#646cff" },
    { name: "Framer Motion", color: "#ff4154" },
  ],
  Backend: [
    { name: "FastAPI", color: "#009688" },
    { name: "Python", color: "#3776ab" },
    { name: "SQLAlchemy", color: "#d71f00" },
  ],
  "Infrastructure & monitoring": [
    { name: "Docker", color: "#2496ed" },
    { name: "Nginx", color: "#009639" },
    { name: "Elasticsearch", color: "#005571" },
    { name: "Kibana", color: "#f04e98" },
    { name: "MySQL 8", color: "#4479a1" },
  ],
};

const STEPS = [
  { n: 1, title: "Start the stack", body: <>Run <code>docker compose up --build</code>. All seven services start automatically.</> },
  { n: 2, title: "Open the app", body: <>Go to <code>http://localhost:5173</code>, or <code>:8080</code> through Nginx. Swagger lives at <code>:8000/docs</code>.</> },
  { n: 3, title: "Create a task", body: "Type a title, optional description, then press Enter or click Add task. Saved to MySQL instantly." },
  { n: 4, title: "Manage tasks", body: "Click the circle to toggle status. Use filters to focus. Hit the trash icon to delete." },
  { n: 5, title: "Watch the logs", body: <>Open Kibana at <code>http://localhost:5601</code>. Every API call appears in your dashboard in real time.</> },
];

export default function LandingPage({ onOpen }) {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="badge">
            <span className="badge-dot" /> Full-stack learning project
          </div>
          <h1>Manage tasks like<br /><em>a real engineer</em></h1>
          <p className="hero-sub">
            TaskFlow is a modern task management system built with React, FastAPI,
            MySQL, Nginx, and a full ELK monitoring stack — all running inside Docker.
          </p>
          <div className="hero-btns">
            <button className="btn-solid" onClick={onOpen}>Open the app →</button>
            <button className="btn-outline"
              onClick={() => document.getElementById("howto").scrollIntoView({ behavior: "smooth" })}>
              How to use
            </button>
          </div>
        </motion.div>

        <div className="metrics">
          {[["7", "services", "purple"], ["REST", "API", "green"],
            ["ELK", "monitoring", "amber"], ["Docker", "containerised", "blue"]
          ].map(([val, label, color]) => (
            <div className="metric" key={label}>
              <div className={`metric-val mv-${color}`}>{val}</div>
              <div className="metric-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="eyebrow">Features</div>
        <h2 className="section-title center">Everything you need</h2>
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="section">
        <h2 className="section-title-left">Tech stack</h2>
        <p className="section-sub">Production-grade tools used end to end</p>
        {Object.entries(STACK).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div className="chip-label">{cat}</div>
            <div className="chips">
              {items.map(i => (
                <div className="chip" key={i.name}>
                  <span className="dot" style={{ background: i.color }} />
                  {i.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Architecture */}
      <section className="section">
        <h2 className="section-title-left">Architecture</h2>
        <p className="section-sub">Seven services, one Docker network</p>
        <div className="arch">
          {[
            [["Frontend","React + Vite",":5173"],["Backend","FastAPI",":8000"],["Gateway","Nginx",":8080"]],
            [["Database","MySQL 8",":3306"],["Search","Elasticsearch",":9200"],["Dashboards","Kibana",":5601"]],
          ].map((row, ri) => (
            <div className="arch-row" key={ri}>
              {row.map(([label, val, port]) => (
                <div className="arch-cell" key={label}>
                  <div className="arch-label">{label}</div>
                  <div className="arch-val">{val}</div>
                  <div className="arch-port">{port}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* How-to */}
      <section className="section" id="howto">
        <div className="eyebrow">Guide</div>
        <h2 className="section-title center">How to use TaskFlow</h2>
        <div className="steps">
          {STEPS.map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />
      <footer>Built with React, FastAPI &amp; Docker · <span>TaskFlow — a full-stack learning project</span></footer>
    </main>
  );
}