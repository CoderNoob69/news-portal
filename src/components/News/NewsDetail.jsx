// src/pages/NewsDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft, FaCalendarAlt, FaBuilding,
  FaFileImage, FaFilePdf, FaFileVideo, FaFileAlt, FaGoogleDrive
} from 'react-icons/fa';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const API_NEWS = 'http://localhost:4000/api/data/news';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setLoading(true);
    axios
      .get(`${API_NEWS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(({ data }) => setItem(data))
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || 'Error loading news');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const fmtDate = iso =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const iconFor = mime => {
    if (!mime) return <FaFileAlt style={{ color: '#1a237e', marginRight: 6 }} />;
    if (mime.startsWith('image/')) return <FaFileImage style={{ color: '#43a047', marginRight: 6 }} />;
    if (mime === 'application/pdf') return <FaFilePdf style={{ color: '#e53935', marginRight: 6 }} />;
    if (mime.startsWith('video/')) return <FaFileVideo style={{ color: '#3949ab', marginRight: 6 }} />;
    return <FaFileAlt style={{ color: '#1a237e', marginRight: 6 }} />;
  };

  const backText = 'Back';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Typography variant="h6" color="primary">Loading…</Typography>
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'News item not found'}
        </Alert>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
        >
          {backText}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',                 // allow responsive width with sidebar space handled upstream
        background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)',
        py: { xs: 6, sm: 10 },         // vertical breathing room; scrolls naturally
        px: { xs: 2, sm: 4 },          // horizontal gutter so card never hugs viewport edge
        boxSizing: 'border-box'
      }}
    >
      <Card
        elevation={8}
        sx={{
          borderRadius: 2,
          maxWidth: 900,
          mx: 'auto',                  // center within wrapper
          boxShadow: 8
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2, fontWeight: 700, borderRadius: 2 }}
          >
            {backText}
          </Button>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h3"
              color="primary"
              sx={{
                fontWeight: 800,
                mb: 1,
                letterSpacing: 0.5,
                fontSize: { xs: '1.9rem', sm: '2.7rem' }, // tiny tweak: prevent overflow on xs
                wordBreak: 'break-word'
              }}
            >
              {item.title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.7, fontWeight: 600 }}
              >
                <FaCalendarAlt /> {fmtDate(item.createdAt)}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.7, fontWeight: 700 }}
              >
                <FaBuilding /> {item.department}
              </Typography>
            </Box>
          </Box>

          {item.body && (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mb: 2, fontSize: '1.13rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}
            >
              {item.body}
            </Typography>
          )}

          {item.files?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" color="primary.dark" sx={{ mb: 1, fontWeight: 700 }}>
                Attachments
              </Typography>
              <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
                {item.files.map((f, i) => (
                  <Box
                    component="li"
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      background: '#f8fbff',
                      borderRadius: 2,
                      boxShadow: 1,
                      p: 1.2,
                      pr: 2
                    }}
                  >
                    {iconFor(f.mimeType)}
                    <a
                      href={f.embedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      {f.originalName || `File ${i + 1}`}
                    </a>
                  </Box>
                ))}
                {item.driveLinks?.map((l, i) => (
                  <Box
                    component="li"
                    key={`link-${i}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      background: '#f8fbff',
                      borderRadius: 2,
                      boxShadow: 1,
                      p: 1.2,
                      pr: 2
                    }}
                  >
                    <FaGoogleDrive style={{ color: '#0f9d58', marginRight: 6 }} />
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      {l.name}
                    </a>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
