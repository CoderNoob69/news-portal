import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

const MAX_SIZE   = 500 * 1024 * 1024; // 500 MB
const API_UPLOAD = 'http://localhost:4000/api/upload';
const API_EVENTS = 'http://localhost:4000/api/events';

const fmtETA = sec => {
  if (sec === '--' || sec === null || isNaN(sec)) return '--';
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const out = [];
  if (h) out.push(`${h}h`);
  if (m) out.push(`${m}m`);
  if (!h && !m) out.push(`${r}s`);
  else if (r) out.push(`${r}s`);
  return out.join(' ');
};

export default function NewsUpload() {
  const navigate = useNavigate();

  const [title,   setTitle]   = useState('');
  const [body,    setBody]    = useState('');
  const [busy,    setBusy]    = useState(false);
  const [rows,    setRows]    = useState([]);
  const [newsId,  setNewsId]  = useState(null);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  /* ------------------------------------------------------------------
   * Dropzone
   * ------------------------------------------------------------------ */
  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) setError('Files > 500 MB were skipped.');
    setRows(prev => ([
      ...prev,
      ...accepted.map(f => ({
        file:   f,
        size:   (f.size / 1024 / 1024).toFixed(1) + ' MB',
        pct:    0,
        status: 'waiting',
        speed:  '--',
        eta:    '--'
      }))
    ]));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    maxSize:  MAX_SIZE,
    onDrop
  });

  /* ------------------------------------------------------------------
   * EventSource (server → drive progress)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const es = new EventSource(API_EVENTS);
    es.onmessage = e => {
      try {
        const { file, pct, speed, eta } = JSON.parse(e.data);
        setRows(rs => rs.map(r =>
          r.file.name === file
            ? { ...r, pct, status: 'server ⇢ Drive', speed: speed + ' MB/s', eta }
            : r
        ));
      } catch (_) {/* ignore malformed events */}
    };
    return () => es.close();
  }, []);

  /* ------------------------------------------------------------------
   * Upload
   * ------------------------------------------------------------------ */
  const uploadAll = async () => {
    if (!title.trim() || rows.length === 0) return;

    setBusy(true);
    setError('');
    setSuccess('');
    let currentId = newsId;

    try {
      for (const row of rows) {
        // update row status (browser -> server)
        setRows(rs => rs.map(r =>
          r.file === row.file ? { ...r, status: 'browser ⇢ server' } : r
        ));

        const fd = new FormData();
        fd.append('title', title);
        fd.append('body',  body);
        fd.append('files', row.file);
        if (currentId) fd.append('newsId', currentId);

        const start = Date.now();
        const { data } = await axios.post(API_UPLOAD, fd, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          onUploadProgress: ev => {
            if (!ev.total) return;
            const pct   = Math.round((ev.loaded / ev.total) * 100);
            const secs  = (Date.now() - start) / 1000;
            const speed = secs
              ? (ev.loaded / 1024 / 1024 / secs).toFixed(2) + ' MB/s'
              : '--';
            setRows(rs => rs.map(r =>
              r.file === row.file ? { ...r, pct, speed, eta: '--' } : r
            ));
          }
        });

        if (!currentId) {
          currentId = data.newsId;
          setNewsId(currentId);
        }
      }

      setSuccess('News created successfully!');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      console.error(err);
      setError('Upload failed.');
      setTimeout(() => navigate(0), 1200);
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------------------------------------------
   * Layout
   * ------------------------------------------------------------------ */
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        py: { xs: 6, sm: 8, md: 12 },   // top/bottom breathing room under navbar
        display: 'flex',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)',
      }}
    >
      <Card
        elevation={8}
        sx={{
          borderRadius: 2,
          width: '100%',
          maxWidth: 700,
          mx: 'auto',
          boxShadow: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}
          >
            Create News Item
          </Typography>

          {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box
            component="form"
            onSubmit={e => { e.preventDefault(); uploadAll(); }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Information"
              value={body}
              onChange={e => setBody(e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={4}
            />

            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle1"
                color="primary.dark"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Attachments
              </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : '#888',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragActive ? '#e3f0ff' : '#f9f9f9',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '1.08rem',
                  mb: 2,
                  transition: 'border-color 0.3s, background 0.3s',
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? 'Drop files…' : 'Drag-drop or click (≤ 500 MB)'}
              </Box>
            </Box>

            {/* uploads list */}
            {rows.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {rows.map(r => (
                  <Card
                    key={r.file.name}
                    sx={{ mb: 2, background: '#f8fbff', borderRadius: 2, boxShadow: 1 }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {r.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.size}
                      </Typography>
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={r.pct}
                          sx={{ height: 8, borderRadius: 4, background: '#eee' }}
                        />
                      </Box>
                      <Typography variant="caption" color="primary.dark">
                        {r.status} — {r.pct}% · {r.speed} · ETA {fmtETA(r.eta)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={busy || !rows.length || !title.trim()}
              sx={{ fontWeight: 700, borderRadius: 2, mt: 1 }}
            >
              {busy ? 'Uploading…' : 'Publish'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
