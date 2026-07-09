import React, { useState, useEffect, useRef, useCallback } from "react";
import { Upload, ChevronLeft, ChevronRight, ImageOff, AlertTriangle, RotateCcw } from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   Paper journal / contact-sheet aesthetic for a photographer's
   personal story blog.
   ============================================================ */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

const STYLES = `
  :root {
    --paper: #EDEEE7;
    --paper-deep: #E3E4DA;
    --ink: #1A1917;
    --ink-soft: #6B6858;
    --line: #D3D0C3;
    --accent: #2F5D62;
    --accent-warm: #B5502D;
    --surface: #FFFFFF;
    --film: #171614;
  }
  * { box-sizing: border-box; }
  .sb-root {
    background: var(--paper);
    min-height: 100%;
    font-family: 'Source Serif 4', serif;
    color: var(--ink);
    padding: 40px 16px 80px;
  }

  /* ---------- Upload screen ---------- */
  .sb-upload-wrap {
    max-width: 480px;
    margin: 10vh auto 0;
    text-align: center;
  }
  .sb-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 14px;
  }
  .sb-upload-title {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 34px;
    line-height: 1.15;
    margin: 0 0 10px;
  }
  .sb-upload-title em {
    font-style: italic;
    font-weight: 500;
    color: var(--accent-warm);
  }
  .sb-upload-sub {
    color: var(--ink-soft);
    font-size: 15px;
    margin: 0 0 32px;
    line-height: 1.5;
  }
  .sb-upload-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 3px;
    padding: 40px 28px;
    box-shadow: 0 1px 0 var(--line);
  }
  .sb-upload-btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.02em;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 13px 26px;
    border-radius: 2px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .sb-upload-btn:hover { background: var(--accent); }
  .sb-upload-btn:active { transform: scale(0.98); }
  .sb-upload-hint {
    margin-top: 16px;
    font-size: 12px;
    color: var(--ink-soft);
    font-family: 'IBM Plex Mono', monospace;
  }
  .sb-error {
    margin-top: 20px;
    background: #FBEAE3;
    border: 1px solid #E3B39E;
    color: #7A2E12;
    border-radius: 2px;
    padding: 12px 14px;
    font-size: 13px;
    display: flex;
    gap: 8px;
    align-items: flex-start;
    text-align: left;
    font-family: 'IBM Plex Mono', monospace;
  }

  /* ---------- Story chrome ---------- */
  .sb-topbar {
    max-width: 800px;
    margin: 0 auto 18px;
    display: flex;
    justify-content: flex-end;
  }
  .sb-reset-btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid var(--line);
    color: var(--ink-soft);
    padding: 8px 12px;
    border-radius: 2px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: border-color 0.15s ease, color 0.15s ease;
  }
  .sb-reset-btn:hover { border-color: var(--accent); color: var(--accent); }

  .sb-container {
    max-width: 800px;
    margin: 0 auto;
    background: var(--surface);
    border: 1px solid var(--line);
  }

  .sb-row {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--line);
  }
  .sb-row:last-child { border-bottom: none; }
  .sb-col {
    padding: 28px 32px;
    min-width: 0;
  }
  .sb-row .sb-col + .sb-col {
    border-left: 1px solid var(--line);
  }
  @media (max-width: 640px) {
    .sb-col { flex-basis: 100% !important; padding: 22px 20px; }
    .sb-row .sb-col + .sb-col { border-left: none; border-top: 1px solid var(--line); }
  }

  /* ---------- Header block ---------- */
  .sb-header-block h1 {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 40px;
    line-height: 1.08;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .sb-header-block h2 {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 500;
    font-size: 18px;
    color: var(--accent-warm);
    margin: 0;
  }
  .sb-header-block p { font-size: 15px; line-height: 1.6; color: var(--ink-soft); }

  /* ---------- Text block ---------- */
  .sb-text-block p {
    font-size: 16px;
    line-height: 1.75;
    margin: 0 0 18px;
  }
  .sb-text-block p:last-child { margin-bottom: 0; }

  /* ---------- Still image block ---------- */
  .sb-still-figure { margin: 0; }
  .sb-still-figure img {
    width: 100%;
    display: block;
    aspect-ratio: 4/5;
    object-fit: cover;
    background: var(--paper-deep);
  }
  .sb-img-fallback {
    width: 100%;
    aspect-ratio: 4/5;
    background: var(--paper-deep);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--ink-soft);
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* ---------- Sliding image block (film-strip signature) ---------- */
  .sb-slider-outer {
    display: flex;
    background: var(--film);
    border-radius: 2px;
    overflow: hidden;
  }
  .sb-film-edge {
    flex: 0 0 18px;
    background-color: #201E1B;
    background-image: radial-gradient(circle, #0B0A09 34%, transparent 35%);
    background-size: 18px 26px;
    background-position: center;
  }
  .sb-slider-main {
    flex: 1;
    min-width: 0;
    position: relative;
  }
  .sb-slider-viewport {
    position: relative;
    width: 100%;
    aspect-ratio: 16/10;
    overflow: hidden;
    background: #0B0A09;
  }
  .sb-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .sb-slide.active { opacity: 1; }
  .sb-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .sb-slider-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(23,22,20,0.55);
    border: none;
    color: #F2F0E8;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .sb-slider-arrow:hover { background: var(--accent-warm); }
  .sb-slider-arrow.prev { left: 10px; }
  .sb-slider-arrow.next { right: 10px; }
  .sb-slider-counter {
    position: absolute;
    bottom: 10px;
    right: 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #F2F0E8;
    background: rgba(23,22,20,0.55);
    padding: 3px 8px;
    border-radius: 10px;
    letter-spacing: 0.03em;
  }
  .sb-contact-sheet {
    display: flex;
    gap: 6px;
    padding: 8px;
    background: #100F0D;
    overflow-x: auto;
  }
  .sb-contact-frame {
    flex: 0 0 56px;
    position: relative;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 1px;
    opacity: 0.55;
    transition: opacity 0.15s ease, border-color 0.15s ease;
  }
  .sb-contact-frame img {
    width: 100%;
    height: 40px;
    object-fit: cover;
    display: block;
  }
  .sb-contact-frame.active {
    opacity: 1;
    border-color: var(--accent-warm);
  }
  .sb-contact-frame .sb-frame-no {
    position: absolute;
    bottom: 1px;
    left: 2px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8px;
    color: #F2F0E8;
    text-shadow: 0 0 3px #000;
  }

  /* ---------- Unknown block ---------- */
  .sb-unknown-block {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--ink-soft);
    background: var(--paper-deep);
    border: 1px dashed var(--line);
    padding: 16px;
    border-radius: 2px;
  }

  .sb-fade-in { animation: sbFadeIn 0.6s ease both; }
  @keyframes sbFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

/* ============================================================
   COLUMN TYPE COMPONENTS
   Each is a standalone component keyed off `columnType`.
   ============================================================ */

function HeaderBlock({ column }) {
  return (
    <div
      className="sb-header-block"
      dangerouslySetInnerHTML={{ __html: column.column_content || "" }}
    />
  );
}

function TextBlock({ column }) {
  return (
    <div
      className="sb-text-block"
      dangerouslySetInnerHTML={{ __html: column.column_content || "" }}
    />
  );
}

function StillImageBlock({ column }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="sb-still-figure">
      {failed || !column.image_path ? (
        <div className="sb-img-fallback">
          <ImageOff size={20} />
          <span>Image unavailable</span>
        </div>
      ) : (
        <img
          src={column.image_path}
          alt=""
          onError={() => setFailed(true)}
        />
      )}
    </figure>
  );
}

function SlidingImageBlock({ column }) {
  const images = Array.isArray(column.images) ? column.images : [];
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [failedMap, setFailedMap] = useState({});
  const count = images.length;

  const next = useCallback(() => {
    if (count > 0) setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count > 0) setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || hovered) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [count, hovered, next]);

  if (count === 0) {
    return (
      <div className="sb-unknown-block">
        No images provided for this slider.
      </div>
    );
  }

  return (
    <div
      className="sb-slider-outer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sb-film-edge" />
      <div className="sb-slider-main">
        <div className="sb-slider-viewport">
          {images.map((src, i) => (
            <div key={i} className={`sb-slide ${i === index ? "active" : ""}`}>
              {failedMap[i] ? (
                <div className="sb-img-fallback" style={{ height: "100%" }}>
                  <ImageOff size={20} />
                  <span>Image unavailable</span>
                </div>
              ) : (
                <img
                  src={src}
                  alt=""
                  onError={() =>
                    setFailedMap((m) => ({ ...m, [i]: true }))
                  }
                />
              )}
            </div>
          ))}
          {count > 1 && (
            <>
              <button className="sb-slider-arrow prev" onClick={prev} aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
              <button className="sb-slider-arrow next" onClick={next} aria-label="Next image">
                <ChevronRight size={18} />
              </button>
              <div className="sb-slider-counter">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </div>
            </>
          )}
        </div>
        {count > 1 && (
          <div className="sb-contact-sheet">
            {images.map((src, i) => (
              <div
                key={i}
                className={`sb-contact-frame ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
              >
                {failedMap[i] ? (
                  <div className="sb-img-fallback" style={{ height: 40, fontSize: 8 }}>
                    <ImageOff size={12} />
                  </div>
                ) : (
                  <img src={src} alt="" />
                )}
                <span className="sb-frame-no">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="sb-film-edge" />
    </div>
  );
}

function UnknownBlock({ column }) {
  return (
    <div className="sb-unknown-block">
      Unrecognized column type: <strong>{String(column.columnType)}</strong>
    </div>
  );
}

const COLUMN_COMPONENTS = {
  Header: HeaderBlock,
  text: TextBlock,
  still_image: StillImageBlock,
  sliding_image: SlidingImageBlock,
};

/* ============================================================
   LAYOUT: Row / Column ordering
   ============================================================ */

function Column({ column }) {
  const Comp = COLUMN_COMPONENTS[column.columnType] || UnknownBlock;
  const width = typeof column.column_width_percentage === "number"
    ? column.column_width_percentage
    : 100;
  return (
    <div className="sb-col" style={{ flexBasis: `${width}%` }}>
      <Comp column={column} />
    </div>
  );
}

function Row({ row }) {
  const columns = [...(row.columns || [])].sort(
    (a, b) => (a.column_order ?? 0) - (b.column_order ?? 0)
  );
  return (
    <div className="sb-row">
      {columns.map((col, i) => (
        <Column key={i} column={col} />
      ))}
    </div>
  );
}

function StoryRenderer({ story }) {
  const rows = [...(story.rows || [])].sort(
    (a, b) => (a.row_order ?? 0) - (b.row_order ?? 0)
  );
  return (
    <div className="sb-container">
      {rows.map((row, i) => (
        <Row key={i} row={row} />
      ))}
    </div>
  );
}

/* ============================================================
   UPLOAD SCREEN
   ============================================================ */

function UploadScreen({ onFileSelected, error }) {
  const inputRef = useRef(null);
  return (
    <div className="sb-upload-wrap sb-fade-in">
      <div className="sb-eyebrow">Story engine</div>
      <h1 className="sb-upload-title">
        Turn a JSON file into <em>a blog</em>
      </h1>
      <p className="sb-upload-sub">
        Upload a story file and it will be laid out row by row, column by
        column, exactly as described inside it.
      </p>
      <div className="sb-upload-card">
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
            e.target.value = "";
          }}
        />
        <button className="sb-upload-btn" onClick={() => inputRef.current?.click()}>
          <Upload size={15} />
          Choose JSON file
        </button>
        <div className="sb-upload-hint">.json — matches the story/rows/columns schema</div>
        {error && (
          <div className="sb-error">
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function StoryBlogApp() {
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed?.story?.rows || !Array.isArray(parsed.story.rows)) {
          setError('This file is valid JSON but is missing a "story.rows" array.');
          return;
        }
        setStory(parsed.story);
      } catch (err) {
        setError("Couldn't parse that file as JSON. Check it's valid JSON and try again.");
      }
    };
    reader.onerror = () => setError("Couldn't read that file. Please try again.");
    reader.readAsText(file);
  };

  return (
    <div className="sb-root">
      <style>{FONTS}</style>
      <style>{STYLES}</style>
      {!story ? (
        <UploadScreen onFileSelected={handleFile} error={error} />
      ) : (
        <>
          <div className="sb-topbar">
            <button className="sb-reset-btn" onClick={() => { setStory(null); setError(null); }}>
              <RotateCcw size={12} />
              Load a different file
            </button>
          </div>
          <div className="sb-fade-in">
            <StoryRenderer story={story} />
          </div>
        </>
      )}
    </div>
  );
}
