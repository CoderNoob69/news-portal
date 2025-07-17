import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaAngleRight, FaBuilding } from 'react-icons/fa';
import './News.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const API_NEWS  = 'http://localhost:4000/api/news';
const API_DEPTS = 'http://localhost:4000/api/data/dept';
const PAGE_SIZE = 20;

const NewsList = ({ departmentFilter = null }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [page, setPage] = useState(1); // For department user pagination
  const [adminPage, setAdminPage] = useState(1); // For admin pagination
  const [hasNext, setHasNext] = useState(false);
  const [depts, setDepts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDate, setSearchDate] = useState(null);
  const [adminSearchDate, setAdminSearchDate] = useState(null);

  const { department } = useParams();
  const location       = useLocation();
  const activeDepartment = department || departmentFilter;
  const navigate = useNavigate();

  // Detect user role
  const userBranch = localStorage.getItem('userBranch');
  const userName = localStorage.getItem('userName');
  // Only treat as department user if userBranch exists AND userName is not FULL_ADMIN_1
  const isDepartmentUser = !!userBranch && userName !== 'FULL_ADMIN_1';

  /* fetch department map once */
  useEffect(() => {
    axios.get(API_DEPTS)
      .then(({ data }) => {
        const map = {};
        data.forEach(d => { map[d.deptShort] = d.deptLong; });
        setDepts(map);
      })
      .catch(console.error);
  }, []);

  /* fetch news */
  useEffect(() => {
    setLoading(true); setError('');
    axios.get(`${API_NEWS}?page=${page}`, {
      headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` }
    })
      .then(({ data }) => {
        const items = activeDepartment
          ? data.data.filter(n => n.department === activeDepartment)
          : data.data;
        setNewsItems(items);
        setHasNext(data.hasNextPage);
      })
      .catch(err => { console.error(err); setError('Error loading news items'); })
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [page, activeDepartment]);

  const fmtDate = iso =>
    new Date(iso).toLocaleDateString(undefined,
      { year:'numeric', month:'short', day:'numeric' });

  const istClock = iso =>
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(new Date(iso));

  // Group news by date
  const groupByDate = (items) => {
    const groups = {};
    items.forEach(item => {
      const date = fmtDate(item.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };
  // For admin: group by date, then by department
  const groupByDateAndDept = (items) => {
    const groups = {};
    items.forEach(item => {
      const date = fmtDate(item.createdAt);
      if (!groups[date]) groups[date] = {};
      if (!groups[date][item.department]) groups[date][item.department] = [];
      groups[date][item.department].push(item);
    });
    return groups;
  };

  if (loading) return <div className="flex-center" style={{ minHeight: 200 }}><div>Loading…</div></div>;
  if (error)   return <div className="flex-center" style={{ minHeight: 200, color: '#d32f2f', fontWeight: 600 }}>{error}</div>;
  if (!newsItems.length)
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: 600, margin: '3rem auto', border: 'none', boxShadow: '0 2px 16px rgba(30, 64, 175, 0.08)' }}>
        <h3 style={{ color: '#2d3a4a', fontWeight: 700 }}>
          {activeDepartment ? `No news for ${activeDepartment}` : 'No news available'}
        </h3>
      </div>
    );

  // Department user: group by date, show all news for that date
  if (isDepartmentUser) {
    const grouped = groupByDate(newsItems);
    // Filter news by title and date
    const filteredGrouped = Object.fromEntries(
      Object.entries(grouped)
        .filter(([date]) => !searchDate || dayjs(date).isSame(searchDate, 'day'))
        .map(([date, items]) => [
          date,
          items.filter(item =>
            item.title.toLowerCase().includes(searchTitle.toLowerCase())
          )
        ])
        .filter(([_, items]) => items.length > 0)
    );
    // Pagination by date groups (10 days per page)
    const allDates = Object.keys(filteredGrouped).sort((a, b) => new Date(b) - new Date(a));
    const totalPages = Math.ceil(allDates.length / 10);
    const pagedDates = allDates.slice((page - 1) * 10, page * 10);
    return (
      <Box sx={{ mt: 2 }}>
        {/* Search controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <TextField
            label="Search by title"
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by date"
              value={searchDate}
              onChange={setSearchDate}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ minWidth: 180 }}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ minWidth: 120, height: 40 }}
            onClick={() => {
              setSearchTitle('');
              setSearchDate(null);
            }}
            disabled={!searchTitle && !searchDate}
          >
            Clear Filters
          </Button>
        </Stack>
        {pagedDates.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 6 }}>
            No news found matching your search.
          </Typography>
        ) : (
          pagedDates.map(date => (
            <Box key={date} sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{
                mb: 2,
                fontWeight: 800,
                borderLeft: '5px solid #42a5f5',
                pl: 2,
                background: 'linear-gradient(90deg, #f5faff 0%, #f7f3fa 100%)',
                color: '#1976d2',
                borderRadius: '1px',
                fontSize: '1.25rem',
                py: 1.5,
                boxShadow: 1,
              }}>
                {date}
              </Typography>
              <Grid container spacing={3}>
                {filteredGrouped[date].map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card elevation={6} sx={{
                      borderRadius: 1,
                      border: '1.5px solid #42a5f5',
                      bgcolor: 'transparent',
                      background: 'linear-gradient(90deg, #f5faff 0%, #f7f3fa 100%)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 6,
                      p: 1.5,
                      transition: 'box-shadow 0.3s, transform 0.2s',
                      '&:hover': {
                        boxShadow: 12,
                        transform: 'translateY(-6px) scale(1.03)',
                      },
                    }}>
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1976d2', fontSize: '1.1rem' }}>{item.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#7e57c2', fontWeight: 600 }}><FaBuilding /> {depts[item.department] || item.department}</Typography>
                      </CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/news/${item.department}/${item._id}`, { state: { fromAdmin: true } })}
                          sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#42a5f5', color: '#fff', '&:hover': { bgcolor: '#1976d2' } }}
                        >
                          Read More <FaAngleRight style={{ marginLeft: 6 }} />
                        </Button>
                        <Typography variant="caption" color="text.secondary">{item.files?.length ?? 0} attachment(s)</Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="contained" sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#42a5f5', color: '#fff', '&:hover': { bgcolor: '#1976d2' } }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <Button variant="contained" sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#42a5f5', color: '#fff', '&:hover': { bgcolor: '#1976d2' } }} disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</Button>
        </Box>
      </Box>
    );
  }

  // Admin: group by date, show department summary for each date, but do NOT list all news for each department
  const grouped = groupByDateAndDept(newsItems);
  const handleSummaryClick = (date, dept) => {
    // Encode date and department for URL
    navigate(`/admin/news/${encodeURIComponent(date)}/${encodeURIComponent(dept)}`);
  };
  // Pagination for admin: 10 days per page
  let adminDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  if (adminSearchDate) {
    adminDates = adminDates.filter(date => dayjs(date).isSame(adminSearchDate, 'day'));
  }
  const adminTotalPages = Math.ceil(adminDates.length / 10);
  const adminPagedDates = adminDates.slice((adminPage - 1) * 10, adminPage * 10);
  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center', maxWidth: 500, justifyContent: 'flex-start' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Search by date"
            value={adminSearchDate}
            onChange={setAdminSearchDate}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ minWidth: 180 }}
          />
        </LocalizationProvider>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          sx={{ minWidth: 120, height: 40 }}
          onClick={() => setAdminSearchDate(null)}
          disabled={!adminSearchDate}
        >
          Clear Filters
        </Button>
      </Stack>
      {adminPagedDates.map(date => (
        <Card key={date} elevation={8} sx={{
          mb: 4,
          borderRadius: 2,
          background: '#faf7fc',
          border: '2px solid #7e57c2',
          boxShadow: '0 4px 24px 0 rgba(66, 165, 245, 0.18)',
          transition: 'box-shadow 0.3s, transform 0.2s',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(66, 165, 245, 0.28)',
            transform: 'translateY(-4px) scale(1.01)',
          },
        }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 900, borderLeft: '6px solid #7e57c2', pl: 2.5, color: '#512da8', borderRadius: '2px', fontSize: '1.45rem', background: '#f4f8fd', py: 2, boxShadow: 2, letterSpacing: 0.5 }}>
              {date}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                {Object.keys(grouped[date]).map(dept => (
                  <Grid item xs={12} sm={6} md={4} key={dept}>
                    <Box
                      className="news-admin-summary-item clickable"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        fontWeight: 700,
                        color: '#1976d2',
                        background: 'linear-gradient(90deg, #f5faff 0%, #ede7f6 100%)',
                        borderRadius: 2,
                        p: 2.2,
                        border: '1.5px solid #42a5f5',
                        boxShadow: 3,
                        cursor: 'pointer',
                        transition: 'background 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #e3f2fd 0%, #ede7f6 100%)',
                          boxShadow: 8,
                          color: '#512da8',
                        },
                      }}
                      onClick={() => handleSummaryClick(date, dept)}
                      tabIndex={0}
                      role="button"
                      onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleSummaryClick(date, dept); }}
                    >
                      <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: '#ede7f6', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontSize: 22, fontWeight: 900, color: '#7e57c2', boxShadow: 1 }}>
                        {dept[0]}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'inherit', fontSize: '1.08rem', mb: 0.2 }}>
                          {depts[dept] || dept}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 500, fontSize: '0.98rem' }}>
                          {grouped[date][dept].length} news
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button variant="contained" sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#42a5f5', color: '#fff', '&:hover': { bgcolor: '#1976d2' } }} disabled={adminPage === 1} onClick={() => setAdminPage(p => p - 1)}>Previous</Button>
        <Button variant="contained" sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#42a5f5', color: '#fff', '&:hover': { bgcolor: '#1976d2' } }} disabled={adminPage === adminTotalPages || adminTotalPages === 0} onClick={() => setAdminPage(p => p + 1)}>Next</Button>
      </Box>
    </Box>
  );
};

// Helper to filter news by date and department
export function filterNewsByDateAndDept(newsItems, date, dept) {
  const fmtDate = iso =>
    new Date(iso).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
  return newsItems.filter(
    n => fmtDate(n.createdAt) === date && n.department === dept
  );
}

export default NewsList;
