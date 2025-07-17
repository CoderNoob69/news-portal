import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaAngleRight, FaBuilding } from 'react-icons/fa';
import './News.css';

const API_NEWS  = 'http://localhost:4000/api/news';
const API_DEPTS = 'http://localhost:4000/api/data/dept';
const PAGE_SIZE = 20;

const NewsList = ({ departmentFilter = null }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [page,      setPage]      = useState(1);
  const [hasNext,   setHasNext]   = useState(false);
  const [depts,     setDepts]     = useState({});
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

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
    return (
      <div className="news-list-grouped-by-date">
        {Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map(date => (
          <div key={date} className="news-date-group">
            <h2 className="news-date-heading">{date}</h2>
            <div className="news-list-cards">
              {grouped[date].map(item => (
                <div key={item._id} className="card" style={{ marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#1a237e', fontSize: 22, letterSpacing: 0.2 }}>
                    <Link to={`/news/${item.department}/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{item.title}</Link>
                  </h3>
                  <div style={{ color: '#1976d2', fontSize: 13, marginBottom: 8 }}><FaBuilding style={{ marginRight: 4 }} /> {depts[item.department] || item.department}</div>
                  {item.body && (
                    <div style={{ color: '#374151', fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>
                      {item.body.length > 150 ? item.body.slice(0, 150) + '…' : item.body}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <Link to={`/news/${item.department}/${item._id}`} className="btn" style={{ fontWeight: 600, fontSize: 15, padding: '0.5em 1.2em', background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)', borderRadius: 6, boxShadow: '0 2px 8px rgba(30, 64, 175, 0.08)', letterSpacing: 0.2 }}>
                      Read More <FaAngleRight style={{ marginLeft: 6 }} />
                    </Link>
                    <span style={{ color: '#607d8b', fontSize: 13 }}>{item.files?.length ?? 0} attachment(s)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex-center" style={{ gap: 16, marginTop: 32 }}>
          <button className="btn" style={{ background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)', opacity: page === 1 ? 0.5 : 1, borderRadius: 6, fontWeight: 700, letterSpacing: 0.2 }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <button className="btn" style={{ background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)', opacity: !hasNext ? 0.5 : 1, borderRadius: 6, fontWeight: 700, letterSpacing: 0.2 }} disabled={!hasNext} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    );
  }

  // Admin: group by date, show department summary for each date, but do NOT list all news for each department
  const grouped = groupByDateAndDept(newsItems);
  const handleSummaryClick = (date, dept) => {
    // Encode date and department for URL
    navigate(`/admin/news/${encodeURIComponent(date)}/${encodeURIComponent(dept)}`);
  };
  return (
    <div className="news-list-grouped-by-date">
      {Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map(date => (
        <div key={date} className="news-date-group">
          <h2 className="news-date-heading">{date}</h2>
          <div className="news-admin-summary-list">
            {Object.keys(grouped[date]).map(dept => (
              <div
                key={dept}
                className="news-admin-summary-item clickable"
                style={{ marginBottom: 12, fontWeight: 600, color: '#1976d2', cursor: 'pointer' }}
                onClick={() => handleSummaryClick(date, dept)}
                tabIndex={0}
                role="button"
                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleSummaryClick(date, dept); }}
              >
                {depts[dept] || dept} department uploaded {grouped[date][dept].length} news
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex-center" style={{ gap: 16, marginTop: 32 }}>
        <button className="btn" style={{ background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)', opacity: page === 1 ? 0.5 : 1, borderRadius: 6, fontWeight: 700, letterSpacing: 0.2 }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <button className="btn" style={{ background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)', opacity: !hasNext ? 0.5 : 1, borderRadius: 6, fontWeight: 700, letterSpacing: 0.2 }} disabled={!hasNext} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
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
