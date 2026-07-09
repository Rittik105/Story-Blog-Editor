import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Upload,
  X,
  Type,
  Image as ImageIcon,
  GalleryHorizontal,
  Heading,
} from "lucide-react";

/* ============================================================
   Shared visual language with the story renderer.
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
  .je-root {
    background: var(--paper);
    min-height: 100%;
    font-family: 'Source Serif 4', serif;
    color: var(--ink);
    padding: 32px 16px 100px;
  }
  .je-shell { max-width: 900px; margin: 0 auto; }

  .je-title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 22px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .je-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 4px;
  }
  .je-h1 {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 30px;
    margin: 0;
  }

  .je-toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
  .je-btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.03em;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    padding: 9px 14px;
    border-radius: 2px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  }
  .je-btn:hover { border-color: var(--accent); color: var(--accent); }
  .je-btn.primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .je-btn.primary:hover { background: var(--accent); border-color: var(--accent); color: var(--paper); }
  .je-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .je-empty {
    margin-top: 40px;
    text-align: center;
    color: var(--ink-soft);
    font-size: 14px;
    border: 1px dashed var(--line);
    border-radius: 3px;
    padding: 48px 20px;
    background: var(--surface);
  }

  .je-row-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 3px;
    margin-top: 16px;
    overflow: hidden;
  }
  .je-row-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--paper-deep);
    border-bottom: 1px solid var(--line);
  }
  .je-row-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  .je-row-actions { display: flex; gap: 6px; }
  .je-icon-btn {
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink-soft);
    width: 28px;
    height: 28px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
  }
  .je-icon-btn:hover { border-color: var(--accent-warm); color: var(--accent-warm); }
  .je-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .je-col-list { padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 10px; }
  .je-chip {
    border: 1px solid var(--line);
    border-radius: 2px;
    padding: 10px 12px;
    min-width: 180px;
    background: var(--paper);
  }
  .je-chip-top { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: var(--accent); }
  .je-chip-type {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .je-chip-meta { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--ink-soft); margin-bottom: 8px; }
  .je-chip-preview { font-size: 13px; color: var(--ink-soft); line-height: 1.4; max-height: 40px; overflow: hidden; margin-bottom: 8px; }
  .je-chip-actions { display: flex; gap: 6px; }

  .je-add-component-btn {
    margin: 4px 16px 16px;
    align-self: flex-start;
  }

  /* ---------- Modal ---------- */
  .je-backdrop {
    position: fixed; inset: 0;
    background: rgba(23,22,20,0.5);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    z-index: 50;
  }
  .je-modal {
    background: var(--surface);
    border-radius: 3px;
    width: 100%;
    max-width: 480px;
    max-height: 88vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.25);
  }
  .je-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid var(--line);
  }
  .je-modal-title {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 19px;
  }
  .je-modal-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
  .je-modal-foot { padding: 14px 18px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 8px; }

  .je-field label {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-soft);
    margin-bottom: 6px;
  }
  .je-field input[type="text"],
  .je-field input[type="number"],
  .je-field input[type="url"],
  .je-field textarea {
    width: 100%;
    font-family: 'Source Serif 4', serif;
    font-size: 14px;
    padding: 9px 10px;
    border: 1px solid var(--line);
    border-radius: 2px;
    background: var(--paper);
    color: var(--ink);
  }
  .je-field textarea { min-height: 100px; resize: vertical; }
  .je-field input:focus, .je-field textarea:focus {
    outline: none; border-color: var(--accent);
  }
  .je-row-2 { display: flex; gap: 12px; }
  .je-row-2 > div { flex: 1; }

  .je-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .je-type-card {
    border: 1px solid var(--line);
    border-radius: 3px;
    padding: 16px 12px;
    background: var(--paper);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
    color: var(--ink);
  }
  .je-type-card:hover { border-color: var(--accent); background: var(--surface); }
  .je-type-card span { font-family: 'IBM Plex Mono', monospace; font-size: 12px; text-align: center; }

  .je-url-item { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
  .je-url-item input { flex: 1; }
  .je-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 2px; border: 1px solid var(--line); flex-shrink: 0; }
  .je-thumb-fallback { width: 40px; height: 40px; border-radius: 2px; border: 1px dashed var(--line); flex-shrink: 0; }

  .je-hint { font-size: 12px; color: var(--ink-soft); }
`;

/* ============================================================
   Helpers
   ============================================================ */
let idCounter = 0;
const nid = () => `id_${Date.now()}_${idCounter++}`;

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphsToHtml(text = "") {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

const TYPE_META = {
  Header: { label: "Header", icon: Heading },
  text: { label: "Text", icon: Type },
  still_image: { label: "Still image", icon: ImageIcon },
  sliding_image: { label: "Sliding image", icon: GalleryHorizontal },
};

function chipPreview(col) {
  if (col.columnType === "Header") return `${col._title || ""} — ${col._subtitle || ""}`;
  if (col.columnType === "text") return (col._text || "").slice(0, 90);
  if (col.columnType === "still_image") return col.image_path || "No URL set";
  if (col.columnType === "sliding_image") return `${(col.images || []).length} image(s)`;
  return "";
}

/* ============================================================
   Preview document builder (plain HTML/CSS/JS, opened in a new tab)
   ============================================================ */
function buildPreviewHtml(story) {
  const rows = [...(story.rows || [])].sort((a, b) => (a.row_order ?? 0) - (b.row_order ?? 0));

  const rowsHtml = rows
    .map((row) => {
      const cols = [...(row.columns || [])].sort((a, b) => (a.column_order ?? 0) - (b.column_order ?? 0));
      const colsHtml = cols
        .map((col) => {
          const width = typeof col.column_width_percentage === "number" ? col.column_width_percentage : 100;
          let inner = "";
          if (col.columnType === "Header" || col.columnType === "text") {
            inner = col.column_content || "";
          } else if (col.columnType === "still_image") {
            inner = col.image_path
              ? `<figure class="p-still"><img src="${escapeHtml(col.image_path)}" alt="" onerror="this.parentElement.classList.add('p-broken')"/></figure>`
              : `<div class="p-fallback">No image URL</div>`;
          } else if (col.columnType === "sliding_image") {
            const imgs = col.images || [];
            const sliderId = nid();
            inner = `
              <div class="p-slider-outer" data-slider="${sliderId}">
                <div class="p-film-edge"></div>
                <div class="p-slider-main">
                  <div class="p-slider-viewport">
                    ${imgs
                      .map(
                        (src, i) =>
                          `<div class="p-slide${i === 0 ? " active" : ""}" data-i="${i}"><img src="${escapeHtml(src)}" alt=""/></div>`
                      )
                      .join("")}
                    ${
                      imgs.length > 1
                        ? `<button class="p-arrow prev" data-dir="-1">&#8249;</button>
                           <button class="p-arrow next" data-dir="1">&#8250;</button>
                           <div class="p-counter"><span class="p-cur">1</span> / ${imgs.length}</div>`
                        : ""
                    }
                  </div>
                  ${
                    imgs.length > 1
                      ? `<div class="p-contact">${imgs
                          .map(
                            (src, i) =>
                              `<div class="p-frame${i === 0 ? " active" : ""}" data-i="${i}"><img src="${escapeHtml(src)}" alt=""/><span>${String(i + 1).padStart(2, "0")}</span></div>`
                          )
                          .join("")}</div>`
                      : ""
                  }
                </div>
                <div class="p-film-edge"></div>
              </div>`;
          } else {
            inner = `<div class="p-fallback">Unrecognized column type: ${escapeHtml(String(col.columnType))}</div>`;
          }
          return `<div class="p-col" style="flex-basis:${width}%">${inner}</div>`;
        })
        .join("");
      return `<div class="p-row">${colsHtml}</div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Story preview</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
:root{--paper:#EDEEE7;--paper-deep:#E3E4DA;--ink:#1A1917;--ink-soft:#6B6858;--line:#D3D0C3;--accent:#2F5D62;--accent-warm:#B5502D;--surface:#FFFFFF;--film:#171614;}
*{box-sizing:border-box;}
body{margin:0;background:var(--paper);font-family:'Source Serif 4',serif;color:var(--ink);padding:40px 16px 80px;}
.p-container{max-width:800px;margin:0 auto;background:var(--surface);border:1px solid var(--line);}
.p-row{display:flex;flex-wrap:wrap;border-bottom:1px solid var(--line);}
.p-row:last-child{border-bottom:none;}
.p-col{padding:28px 32px;min-width:0;}
.p-row .p-col + .p-col{border-left:1px solid var(--line);}
@media (max-width:640px){.p-col{flex-basis:100% !important;padding:22px 20px;}.p-row .p-col + .p-col{border-left:none;border-top:1px solid var(--line);}}
.p-col h1{font-family:'Fraunces',serif;font-weight:700;font-size:40px;line-height:1.08;margin:0 0 8px;}
.p-col h2{font-family:'Fraunces',serif;font-style:italic;font-weight:500;font-size:18px;color:var(--accent-warm);margin:0;}
.p-col p{font-size:16px;line-height:1.75;margin:0 0 18px;}
.p-col p:last-child{margin-bottom:0;}
.p-still img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;background:var(--paper-deep);}
.p-fallback{width:100%;padding:40px 10px;text-align:center;background:var(--paper-deep);color:var(--ink-soft);font-family:'IBM Plex Mono',monospace;font-size:12px;border-radius:2px;}
.p-slider-outer{display:flex;background:var(--film);border-radius:2px;overflow:hidden;}
.p-film-edge{flex:0 0 18px;background-color:#201E1B;background-image:radial-gradient(circle,#0B0A09 34%, transparent 35%);background-size:18px 26px;background-position:center;}
.p-slider-main{flex:1;min-width:0;}
.p-slider-viewport{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;background:#0B0A09;}
.p-slide{position:absolute;inset:0;opacity:0;transition:opacity .5s ease;}
.p-slide.active{opacity:1;}
.p-slide img{width:100%;height:100%;object-fit:cover;display:block;}
.p-arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(23,22,20,.55);border:none;color:#F2F0E8;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;}
.p-arrow:hover{background:var(--accent-warm);}
.p-arrow.prev{left:10px;}
.p-arrow.next{right:10px;}
.p-counter{position:absolute;bottom:10px;right:12px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#F2F0E8;background:rgba(23,22,20,.55);padding:3px 8px;border-radius:10px;}
.p-contact{display:flex;gap:6px;padding:8px;background:#100F0D;overflow-x:auto;}
.p-frame{flex:0 0 56px;position:relative;cursor:pointer;border:2px solid transparent;opacity:.55;}
.p-frame.active{opacity:1;border-color:var(--accent-warm);}
.p-frame img{width:100%;height:40px;object-fit:cover;display:block;}
.p-frame span{position:absolute;bottom:1px;left:2px;font-family:'IBM Plex Mono',monospace;font-size:8px;color:#F2F0E8;text-shadow:0 0 3px #000;}
</style>
</head>
<body>
<div class="p-container">${rowsHtml}</div>
<script>
document.querySelectorAll('.p-slider-outer').forEach(function(outer){
  var slides = outer.querySelectorAll('.p-slide');
  var frames = outer.querySelectorAll('.p-frame');
  var curEl = outer.querySelector('.p-cur');
  var index = 0;
  var count = slides.length;
  var timer = null;

  function show(i){
    index = (i + count) % count;
    slides.forEach(function(s, si){ s.classList.toggle('active', si === index); });
    frames.forEach(function(f, fi){ f.classList.toggle('active', fi === index); });
    if (curEl) curEl.textContent = index + 1;
  }
  function nextSlide(){ show(index + 1); }
  function restart(){
    if (timer) clearInterval(timer);
    if (count > 1) timer = setInterval(nextSlide, 4000);
  }
  outer.querySelectorAll('.p-arrow').forEach(function(btn){
    btn.addEventListener('click', function(){
      show(index + parseInt(btn.dataset.dir, 10));
      restart();
    });
  });
  frames.forEach(function(f){
    f.addEventListener('click', function(){
      show(parseInt(f.dataset.i, 10));
      restart();
    });
  });
  outer.addEventListener('mouseenter', function(){ if (timer) clearInterval(timer); });
  outer.addEventListener('mouseleave', restart);
  restart();
});
</script>
</body>
</html>`;
}

/* ============================================================
   Type picker modal
   ============================================================ */
function TypePickerModal({ onPick, onClose }) {
  return (
    <div className="je-backdrop" onClick={onClose}>
      <div className="je-modal" onClick={(e) => e.stopPropagation()}>
        <div className="je-modal-head">
          <div className="je-modal-title">Add a component</div>
          <button className="je-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="je-modal-body">
          <div className="je-type-grid">
            {Object.entries(TYPE_META).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={key} className="je-type-card" onClick={() => onPick(key)}>
                  <Icon size={22} />
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Content modal — fields differ by columnType
   ============================================================ */
function ContentModal({ initial, onSave, onClose }) {
  const [columnType] = useState(initial.columnType);
  const [order, setOrder] = useState(initial.column_order ?? 1);
  const [widthPct, setWidthPct] = useState(initial.column_width_percentage ?? 100);

  const [title, setTitle] = useState(initial._title ?? "");
  const [subtitle, setSubtitle] = useState(initial._subtitle ?? "");
  const [text, setText] = useState(initial._text ?? "");
  const [imagePath, setImagePath] = useState(initial.image_path ?? "");
  const [images, setImages] = useState(initial.images?.length ? initial.images : [""]);

  const meta = TYPE_META[columnType];
  const Icon = meta.icon;

  const canSave =
    columnType === "Header"
      ? title.trim().length > 0
      : columnType === "text"
      ? text.trim().length > 0
      : columnType === "still_image"
      ? imagePath.trim().length > 0
      : columnType === "sliding_image"
      ? images.some((u) => u.trim().length > 0)
      : false;

  const handleSave = () => {
    const base = {
      id: initial.id || nid(),
      columnType,
      column_order: Number(order) || 1,
      column_width_percentage: Number(widthPct) || 0,
    };
    if (columnType === "Header") {
      base._title = title;
      base._subtitle = subtitle;
      base.column_content = `<h1>${escapeHtml(title)}</h1><br><h2>${escapeHtml(subtitle)}</h2>`;
    } else if (columnType === "text") {
      base._text = text;
      base.column_content = paragraphsToHtml(text);
    } else if (columnType === "still_image") {
      base.image_path = imagePath.trim();
    } else if (columnType === "sliding_image") {
      base.images = images.map((u) => u.trim()).filter(Boolean);
    }
    onSave(base);
  };

  return (
    <div className="je-backdrop" onClick={onClose}>
      <div className="je-modal" onClick={(e) => e.stopPropagation()}>
        <div className="je-modal-head">
          <div className="je-modal-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon size={18} /> {meta.label}
          </div>
          <button className="je-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="je-modal-body">
          <div className="je-row-2">
            <div className="je-field">
              <label>Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} min={1} />
            </div>
            <div className="je-field">
              <label>Width %</label>
              <input type="number" value={widthPct} onChange={(e) => setWidthPct(e.target.value)} min={1} max={100} />
            </div>
          </div>

          {columnType === "Header" && (
            <>
              <div className="je-field">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Journey" />
              </div>
              <div className="je-field">
                <label>Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="The tale of an emerging photographer" />
              </div>
            </>
          )}

          {columnType === "text" && (
            <div className="je-field">
              <label>Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"Write your paragraph here.\n\nLeave a blank line to start a new paragraph."}
              />
              <div className="je-hint" style={{ marginTop: 6 }}>Blank lines separate paragraphs.</div>
            </div>
          )}

          {columnType === "still_image" && (
            <div className="je-field">
              <label>Image URL</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {imagePath ? (
                  <img src={imagePath} alt="" className="je-thumb" onError={(e) => (e.target.style.visibility = "hidden")} />
                ) : (
                  <div className="je-thumb-fallback" />
                )}
                <input type="url" value={imagePath} onChange={(e) => setImagePath(e.target.value)} placeholder="https://..." />
              </div>
            </div>
          )}

          {columnType === "sliding_image" && (
            <div className="je-field">
              <label>Image URLs</label>
              {images.map((url, i) => (
                <div className="je-url-item" key={i}>
                  {url ? (
                    <img src={url} alt="" className="je-thumb" onError={(e) => (e.target.style.visibility = "hidden")} />
                  ) : (
                    <div className="je-thumb-fallback" />
                  )}
                  <input
                    type="url"
                    value={url}
                    placeholder="https://..."
                    onChange={(e) => {
                      const next = [...images];
                      next[i] = e.target.value;
                      setImages(next);
                    }}
                  />
                  <button
                    className="je-icon-btn"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    disabled={images.length <= 1}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button className="je-btn" onClick={() => setImages([...images, ""])}>
                <Plus size={13} /> Add another image
              </button>
            </div>
          )}
        </div>
        <div className="je-modal-foot">
          <button className="je-btn" onClick={onClose}>Cancel</button>
          <button className="je-btn primary" onClick={handleSave} disabled={!canSave}>Save component</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Row card
   ============================================================ */
function RowCard({ row, rowIndex, rowCount, onMove, onDelete, onAddComponent, onEditComponent, onDeleteComponent }) {
  return (
    <div className="je-row-card">
      <div className="je-row-head">
        <span className="je-row-label">Row {rowIndex + 1}</span>
        <div className="je-row-actions">
          <button className="je-icon-btn" onClick={() => onMove(rowIndex, -1)} disabled={rowIndex === 0}><ArrowUp size={13} /></button>
          <button className="je-icon-btn" onClick={() => onMove(rowIndex, 1)} disabled={rowIndex === rowCount - 1}><ArrowDown size={13} /></button>
          <button className="je-icon-btn" onClick={() => onDelete(rowIndex)}><Trash2 size={13} /></button>
        </div>
      </div>
      <div className="je-col-list">
        {row.columns.length === 0 && (
          <div className="je-hint">No components yet in this row.</div>
        )}
        {row.columns.map((col) => {
          const meta = TYPE_META[col.columnType];
          const Icon = meta.icon;
          return (
            <div className="je-chip" key={col.id}>
              <div className="je-chip-top">
                <Icon size={14} />
                <span className="je-chip-type">{meta.label}</span>
              </div>
              <div className="je-chip-meta">order {col.column_order} · {col.column_width_percentage}%</div>
              <div className="je-chip-preview">{chipPreview(col)}</div>
              <div className="je-chip-actions">
                <button className="je-icon-btn" onClick={() => onEditComponent(rowIndex, col)}><Pencil size={13} /></button>
                <button className="je-icon-btn" onClick={() => onDeleteComponent(rowIndex, col.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="je-btn je-add-component-btn" onClick={() => onAddComponent(rowIndex)}>
        <Plus size={13} /> Add component
      </button>
    </div>
  );
}

/* ============================================================
   Root editor app
   ============================================================ */
export default function StoryJsonEditor() {
  const [rows, setRows] = useState([]);
  const [typePickerFor, setTypePickerFor] = useState(null); // rowIndex or null
  const [contentModal, setContentModal] = useState(null); // { rowIndex, initial } or null
  const fileInputRef = useRef(null);

  const addRow = () => {
    setRows((r) => [...r, { id: nid(), columns: [] }]);
  };

  const moveRow = (index, dir) => {
    setRows((r) => {
      const next = [...r];
      const target = index + dir;
      if (target < 0 || target >= next.length) return r;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const deleteRow = (index) => {
    setRows((r) => r.filter((_, i) => i !== index));
  };

  const openTypePicker = (rowIndex) => setTypePickerFor(rowIndex);

  const handleTypePicked = (columnType) => {
    const rowIndex = typePickerFor;
    setTypePickerFor(null);
    setContentModal({
      rowIndex,
      initial: { columnType, column_order: rows[rowIndex].columns.length + 1, column_width_percentage: 100 },
    });
  };

  const handleEditComponent = (rowIndex, col) => {
    setContentModal({ rowIndex, initial: col });
  };

  const handleSaveComponent = (component) => {
    const { rowIndex } = contentModal;
    setRows((r) => {
      const next = [...r];
      const row = { ...next[rowIndex] };
      const existingIndex = row.columns.findIndex((c) => c.id === component.id);
      if (existingIndex >= 0) {
        row.columns = row.columns.map((c, i) => (i === existingIndex ? component : c));
      } else {
        row.columns = [...row.columns, component];
      }
      next[rowIndex] = row;
      return next;
    });
    setContentModal(null);
  };

  const handleDeleteComponent = (rowIndex, componentId) => {
    setRows((r) => {
      const next = [...r];
      next[rowIndex] = { ...next[rowIndex], columns: next[rowIndex].columns.filter((c) => c.id !== componentId) };
      return next;
    });
  };

  const buildStory = () => ({
    story: {
      rows: rows.map((row, i) => ({
        row_order: i + 1,
        columns: [...row.columns]
          .sort((a, b) => a.column_order - b.column_order)
          .map((c) => {
            const out = {
              column_order: c.column_order,
              columnType: c.columnType,
              column_width_percentage: c.column_width_percentage,
            };
            if (c.columnType === "Header" || c.columnType === "text") out.column_content = c.column_content;
            if (c.columnType === "still_image") out.image_path = c.image_path;
            if (c.columnType === "sliding_image") out.images = c.images;
            return out;
          }),
      })),
    },
  });

  const handlePreview = () => {
    const html = buildPreviewHtml(buildStory().story);
    const win = window.open("", "_blank");
    if (!win) {
      alert("Your browser blocked the preview popup. Please allow popups for this page and try again.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const handleSave = () => {
    const json = JSON.stringify(buildStory(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "story.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const loadedRows = (parsed?.story?.rows || []).map((row) => ({
          id: nid(),
          columns: (row.columns || []).map((col) => {
            const base = {
              id: nid(),
              columnType: col.columnType,
              column_order: col.column_order ?? 1,
              column_width_percentage: col.column_width_percentage ?? 100,
            };
            if (col.columnType === "Header") {
              base.column_content = col.column_content || "";
              const match = /<h1>(.*?)<\/h1>.*?<h2>(.*?)<\/h2>/s.exec(col.column_content || "");
              base._title = match ? match[1] : "";
              base._subtitle = match ? match[2] : "";
            } else if (col.columnType === "text") {
              base.column_content = col.column_content || "";
              base._text = (col.column_content || "").replace(/<\/p>\s*<p>/g, "\n\n").replace(/<\/?p>/g, "").replace(/<br\s*\/?>/g, "\n");
            } else if (col.columnType === "still_image") {
              base.image_path = col.image_path || "";
            } else if (col.columnType === "sliding_image") {
              base.images = col.images || [];
            }
            return base;
          }),
        }));
        setRows(loadedRows);
      } catch (err) {
        alert("Couldn't parse that file as JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="je-root">
      <style>{FONTS}</style>
      <style>{STYLES}</style>
      <div className="je-shell">
        <div className="je-title-row">
          <div>
            <div className="je-eyebrow">Story engine</div>
            <h1 className="je-h1">Editor</h1>
          </div>
          <div className="je-toolbar">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLoad(file);
                e.target.value = "";
              }}
            />
            <button className="je-btn" onClick={() => fileInputRef.current?.click()}>
              <Upload size={13} /> Load JSON
            </button>
            <button className="je-btn" onClick={handlePreview} disabled={rows.length === 0}>
              <Eye size={13} /> Preview
            </button>
            <button className="je-btn primary" onClick={handleSave} disabled={rows.length === 0}>
              <Download size={13} /> Save JSON
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="je-empty">No rows yet. Add your first row to start building the story.</div>
        ) : (
          rows.map((row, i) => (
            <RowCard
              key={row.id}
              row={row}
              rowIndex={i}
              rowCount={rows.length}
              onMove={moveRow}
              onDelete={deleteRow}
              onAddComponent={openTypePicker}
              onEditComponent={handleEditComponent}
              onDeleteComponent={handleDeleteComponent}
            />
          ))
        )}

        <button className="je-btn" style={{ marginTop: 16 }} onClick={addRow}>
          <Plus size={14} /> Add row
        </button>
      </div>

      {typePickerFor !== null && (
        <TypePickerModal onPick={handleTypePicked} onClose={() => setTypePickerFor(null)} />
      )}
      {contentModal && (
        <ContentModal
          initial={contentModal.initial}
          onSave={handleSaveComponent}
          onClose={() => setContentModal(null)}
        />
      )}
    </div>
  );
}
