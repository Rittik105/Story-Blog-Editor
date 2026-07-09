import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { PenSquare, UploadCloud, ArrowLeft } from "lucide-react";
import StoryBlogApp from "./StoryBlogApp.jsx";
import StoryJsonEditor from "./StoryJsonEditor.jsx";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

const STYLES = `
  :root {
    --paper: #EDEEE7;
    --ink: #1A1917;
    --ink-soft: #6B6858;
    --line: #D3D0C3;
    --accent: #2F5D62;
    --accent-warm: #B5502D;
    --surface: #FFFFFF;
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }

  .m-root {
    min-height: 100vh;
    background: var(--paper);
    font-family: 'Source Serif 4', serif;
    color: var(--ink);
  }

  .m-menu-wrap {
    max-width: 640px;
    margin: 0 auto;
    padding: 14vh 20px 40px;
    text-align: center;
  }
  .m-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
  }
  .m-title {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 36px;
    margin: 0 0 40px;
  }
  .m-options { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
  .m-card {
    flex: 1;
    min-width: 220px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 3px;
    padding: 32px 22px;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }
  .m-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .m-card svg { color: var(--accent-warm); margin-bottom: 14px; }
  .m-card h3 {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 19px;
    margin: 0 0 6px;
  }
  .m-card p {
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.5;
    margin: 0;
  }

  .m-back-btn {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 100;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: var(--surface);
    border: 1px solid var(--line);
    color: var(--ink-soft);
    padding: 8px 12px;
    border-radius: 2px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .m-back-btn:hover { border-color: var(--accent); color: var(--accent); }
`;

function Menu({ onSelect }) {
  return (
    <div className="m-menu-wrap">
      <div className="m-eyebrow">Story engine</div>
      <h1 className="m-title">What would you like to do?</h1>
      <div className="m-options">
        <div className="m-card" onClick={() => onSelect("create")}>
          <PenSquare size={22} />
          <h3>Create a story</h3>
          <p>Build a new story row by row in the editor, then save it as a JSON file.</p>
        </div>
        <div className="m-card" onClick={() => onSelect("upload")}>
          <UploadCloud size={22} />
          <h3>Upload a story</h3>
          <p>Open an existing story JSON file and view it rendered as a blog.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState(null); // null | "create" | "upload"

  return (
    <div className="m-root">
      <style>{FONTS}</style>
      <style>{STYLES}</style>

      {mode && (
        <button className="m-back-btn" onClick={() => setMode(null)}>
          <ArrowLeft size={12} /> Menu
        </button>
      )}

      {mode === null && <Menu onSelect={setMode} />}
      {mode === "create" && <StoryJsonEditor />}
      {mode === "upload" && <StoryBlogApp />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
