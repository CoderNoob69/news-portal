import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Card, CardContent, Typography, Button, Avatar, Stack, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { filterNewsByDateAndDept } from './NewsList';

const API_NEWS = 'http://localhost:4000/api/news';
const API_DEPTS = 'http://localhost:4000/api/data/dept';

export default function AdminNewsDetail() {
  const { date, department } = useParams();
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [depts, setDepts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    Promise.all([
      axios.get(API_NEWS, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
      axios.get(API_DEPTS)
    ])
      .then(([newsRes, deptRes]) => {
        setNewsItems(newsRes.data.data);
        const map = {};
        deptRes.data.forEach(d => { map[d.deptShort] = d.deptLong; });
        setDepts(map);
      })
      .catch(() => setError('Error loading news'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterNewsByDateAndDept(newsItems, date, department);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 1, sm: 3 } }}>
      <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          color="primary"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Back to summary
        </Button>
        <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 3, textAlign: 'center' }}>
          {date} — {depts[department] || department} Department
        </Typography>
        {loading ? (
          <Alert severity="info" sx={{ my: 4, textAlign: 'center' }}>Loading…</Alert>
        ) : error ? (
          <Alert severity="error" sx={{ my: 4, textAlign: 'center' }}>{error}</Alert>
        ) : filtered.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fbff', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No news found for this group.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {filtered.map(item => (
              <Card key={item._id} elevation={2} sx={{ borderRadius: 3, p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56, mr: { sm: 2 }, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                  <ApartmentIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.dark"
                    sx={{ mb: 1, cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: 'primary.main' } }}
                    onClick={() => navigate(`/news/${item.department}/${item._id}`)}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ApartmentIcon fontSize="small" sx={{ mr: 0.5 }} /> {depts[item.department] || item.department}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <AttachFileIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {item.files?.length ?? 0} attachment(s)
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
} 