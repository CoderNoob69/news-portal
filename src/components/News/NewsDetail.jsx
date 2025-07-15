// src/pages/NewsDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft, FaCalendarAlt, FaBuilding,
  FaFileImage, FaFilePdf, FaFileVideo, FaFileAlt, FaGoogleDrive
} from 'react-icons/fa';
import './News.css';

const API_NEWS = 'http://localhost:4000/api/data/news';   // base path to backend

export default function NewsDetail() {
  /* params now include deptShort AND id */
  const { deptShort, id } = useParams();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);   // true ⇢ show spinner
  const [error,   setError]   = useState('');     // non‑empty ⇢ show message

  /* fetch on mount / id change */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    setLoading(true); setError('');
    axios.get(`${API_NEWS}/${id}`, {
      headers:{ Authorization:`Bearer ${token}` }
    })
      .then(({ data }) => setItem(data))
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || 'Error loading news');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  /* helpers */
  const fmtDate = iso =>
    new Date(iso).toLocaleDateString(undefined,
      { year:'numeric', month:'long', day:'numeric' });

  const iconFor = mime => {
    if (!mime) return <FaFileAlt  style={{color:'#1a237e', marginRight:6}}/>;
    if (mime.startsWith('image/'))  return <FaFileImage style={{color:'#43a047', marginRight:6}}/>;
    if (mime === 'application/pdf') return <FaFilePdf   style={{color:'#e53935', marginRight:6}}/>;
    if (mime.startsWith('video/'))  return <FaFileVideo style={{color:'#3949ab', marginRight:6}}/>;
    return <FaFileAlt style={{color:'#1a237e', marginRight:6}}/>;
  };

  /* decide back‑link */
  const backTo   = location.state?.fromAdmin
    ? '/admin'
    : `/department/${deptShort ?? ''}`;
  const backText = location.state?.fromAdmin ? 'Back to Home' : 'Back to News';

  /* ---------- render states ---------- */
  if (loading) return (
    <div className="news-detail-container">
      <div className="loading-spinner">Loading…</div>
    </div>
  );

  if (error || !item) return (
    <div className="news-detail-container">
      <div className="error-message">{error || 'News item not found'}</div>
      <Link to={backTo} className="back-link"><FaArrowLeft/> {backText}</Link>
    </div>
  );

  /* ---------- normal render ---------- */
  return (
    <div className="news-detail-container">
      <div className="news-detail-card">
        <Link to={backTo} className="back-link">
          <FaArrowLeft/> {backText}
        </Link>

        <div className="news-header">
          <h1 className="news-title">{item.title}</h1>
          <div className="news-meta">
            <div className="meta-item">
              <FaCalendarAlt/>
              <span>{fmtDate(item.createdAt)}</span>
            </div>
            <div className="meta-item">
              <FaBuilding/>
              <span>{item.department}</span>
            </div>
          </div>
        </div>

        {item.body && (
          <div className="news-description"><p>{item.body}</p></div>
        )}

        {item.files?.length > 0 && (
          <div className="news-attachments">
            <h3>Attachments</h3>
            <ul className="attachment-list">
              {item.files.map((f,i)=>(
                <li key={i}
                    className="attachment-item"
                    style={{display:'flex',alignItems:'center',listStyle:'none',marginBottom:2}}>
                  {iconFor(f.mimeType)}
                  <a href={f.embedLink} target="_blank" rel="noopener noreferrer"
                     style={{color:'#1a237e', textDecoration:'underline'}}>
                    {f.originalName || `File ${i+1}`}
                  </a>
                </li>
              ))}
              {item.driveLinks?.map((l,i)=>(
                <li key={`link-${i}`}
                    className="attachment-item"
                    style={{display:'flex',alignItems:'center',listStyle:'none',marginBottom:2}}>
                  <FaGoogleDrive style={{color:'#0f9d58', marginRight:6}}/>
                  <a href={l.url} target="_blank" rel="noopener noreferrer"
                     style={{color:'#1a237e', textDecoration:'underline'}}>
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
