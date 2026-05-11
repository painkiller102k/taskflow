import Logo from "./Logo";

export default function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => setPage("landing")}>
        <Logo size={32} />
        TaskFlow
      </div>
      <div className="nav-links">
        <button
          className={`nav-btn ${page === "landing" ? "active" : ""}`}
          onClick={() => setPage("landing")}
        >
          About
        </button>
        <button
          className={`nav-btn ${page === "app" ? "active" : ""}`}
          onClick={() => setPage("app")}
        >
          App
        </button>
      </div>
    </nav>
  );
}