import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

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
    <div style={{maxWidth:720,margin:'0 auto',fontFamily:'system-ui'}}>
      <h2>Create News Item</h2>

      <input
        style={{width:'100%',padding:8,margin:'8px 0'}}
        placeholder="Title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />

      <textarea
        rows={4}
        style={{width:'100%',padding:8,marginBottom:8}}
        placeholder="Body"
        value={body}
        onChange={e=>setBody(e.target.value)}
      />

      <div {...getRootProps()} style={{
        border:'2px dashed #777',padding:28,textAlign:'center',
        cursor:'pointer',marginBottom:16
      }}>
        <input {...getInputProps()} />
        {isDragActive ? 'Drop files…' : 'Drag-drop or click (≤ 500 MB)'}
      </div>

      {rows.map(r=>(
        <div key={r.file.name} style={card}>
          <b>{r.file.name}</b> <small>({r.size})</small>
          <div style={{background:'#eee',borderRadius:4,overflow:'hidden',margin:'6px 0'}}>
            <div style={bar(r.pct)} />
          </div>
          <small>{r.status} — {r.pct}% · {r.speed} · ETA {fmtETA(r.eta)}</small>
        </div>
      ))}

      <button
        onClick={uploadAll}
        disabled={busy || !rows.length || !title.trim()}
        style={{padding:'8px 24px',fontSize:16}}
      >
        {busy ? 'Uploading…' : 'Publish'}
      </button>
    </div>
  );
}
