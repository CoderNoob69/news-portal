import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './t.css';

const MAX_SIZE   = 500 * 1024 * 1024;
const API_UPLOAD = 'http://localhost:4000/api/upload';
const API_EVENTS = 'http://localhost:4000/api/events';

/* helper – seconds → friendly "Hh Mm Ss" string  */
const fmtETA = sec => {
  if (sec === '--' || sec === null || isNaN(sec)) return '--';
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const out = [];
  if (h) out.push(`${h}h`);
  if (m) out.push(`${m}m`);
  if (!h && !m) out.push(`${r}s`);       // seconds only
  else if (r)   out.push(`${r}s`);       // keep seconds if non-zero
  return out.join(' ');
};

export default function NewsUpload() {
  const [title, setTitle]   = useState('');
  const [body,  setBody]    = useState('');
  const [busy,  setBusy]    = useState(false);
  const [rows,  setRows]    = useState([]);   // {file,size,pct,status,speed,eta}
  const [newsId,setNewsId]  = useState(null);

  /* ───────── dropzone ───────── */
  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) alert('Files > 500 MB were skipped.');
    setRows(prev => [
      ...prev,
      ...accepted.map(f => ({
        file: f,
        size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
        pct: 0,
        status: 'waiting',
        speed: '--',
        eta: '--'
      }))
    ]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true, maxSize: MAX_SIZE, onDrop
  });

  /* ───── server → Drive progress (SSE) ───── */
  useEffect(() => {
    const es = new EventSource(API_EVENTS);
    es.onmessage = e => {
      const { file, pct, speed, eta } = JSON.parse(e.data);   // eta is seconds
      setRows(rs => rs.map(r =>
        r.file.name === file
          ? { ...r, pct, status:'server ⇢ Drive', speed: speed + ' MB/s', eta }
          : r
      ));
    };
    return () => es.close();
  }, []);

  /* ───── sequential uploads ───── */
  const uploadAll = async () => {
    if (!title.trim() || rows.length === 0) return;
    setBusy(true);

    let currentId = newsId;   // mutable inside loop

    try {
      for (const row of rows) {
        setRows(rs => rs.map(r =>
          r.file === row.file ? { ...r, status:'browser ⇢ server' } : r
        ));

        const fd = new FormData();
        fd.append('title', title);
        fd.append('body',  body);
        fd.append('files', row.file);
        if (currentId) fd.append('newsId', currentId);

        const begun = Date.now();
        const { data } = await axios.post(API_UPLOAD, fd, {
          headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` },
          onUploadProgress: ev => {
            if (!ev.total) return;
            const pct    = Math.round((ev.loaded / ev.total) * 100);
            const secs   = (Date.now() - begun) / 1000;
            const speed  = secs ? (ev.loaded / 1024 / 1024 / secs).toFixed(2) + ' MB/s' : '--';
            setRows(rs => rs.map(r =>
              r.file === row.file ? { ...r, pct, speed, eta:'--' } : r
            ));
          }
        });

        if (!currentId) { currentId = data.newsId; setNewsId(currentId); }
      }
      alert('News created successfully!');
    } catch (err) { console.error(err); alert('Upload failed.'); }
    finally { setBusy(false); }
  };

  /* ───── simple inline UI ───── */
  const card = { border:'1px solid #ccc',borderRadius:6,padding:12,marginBottom:12 };
  const bar  = p => ({
    width:p+'%',height:8,borderRadius:4,
    background:p===100?'#4caf50':'#2196f3',transition:'width .2s linear'
  });

  return (
    <div className="news-upload-container">
      <div className="news-upload-card">
        <h2 className="news-upload-title">Create News Item</h2>
        <form className="news-upload-form" onSubmit={e => { e.preventDefault(); uploadAll(); }}>
          <div className="form-group">
            <label className="news-upload-label" htmlFor="news-title">Title</label>
            <input
              id="news-title"
              className="news-upload-input"
              placeholder="Title"
              value={title}
              onChange={e=>setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="news-upload-label" htmlFor="news-body">Body</label>
            <textarea
              id="news-body"
              rows={4}
              className="news-upload-textarea"
              placeholder="Body"
              value={body}
              onChange={e=>setBody(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="news-upload-label">Attachments</label>
            <div {...getRootProps()} className={`news-upload-dropzone${isDragActive ? ' active' : ''}`}>
              <input {...getInputProps()} />
              {isDragActive ? 'Drop files…' : 'Drag-drop or click (≤ 500 MB)'}
            </div>
          </div>
          {rows.map(r=>(
            <div key={r.file.name} className="news-upload-file-card">
              <b>{r.file.name}</b> <small>({r.size})</small>
              <div className="news-upload-progress-bg">
                <div className="news-upload-progress-bar" style={{width: r.pct + '%', background: r.pct === 100 ? '#4caf50' : '#2196f3'}} />
              </div>
              <small>{r.status} — {r.pct}% · {r.speed} · ETA {fmtETA(r.eta)}</small>
            </div>
          ))}
          <button
            type="submit"
            disabled={busy || !rows.length || !title.trim()}
            className="news-upload-btn"
          >
            {busy ? 'Uploading…' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}
