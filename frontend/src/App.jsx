import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AppPage from "./pages/AppPage";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="root">
      <Navbar page={page} setPage={setPage} />
      <div className="progress-bar">
        <div className="progress-fill" id="global-prog" style={{ width: "0%" }} />
      </div>
      {page === "landing"
        ? <LandingPage onOpen={() => setPage("app")} />
        : <AppPage />
      }
    </div>
  );
}