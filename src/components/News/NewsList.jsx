import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
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

  if (loading) return <div className="loading-spinner">Loading…</div>;
  if (error)   return <div className="error-message">{error}</div>;
  if (!newsItems.length)
    return (
      <div className="no-news-message">
        {activeDepartment ? `No news for ${activeDepartment}` : 'No news available'}
      </div>
    );

  return (
    <div className="news-list-container">
      {activeDepartment && (
        <h2 className="department-heading">{activeDepartment} News</h2>
      )}

      <div className="news-list">
        {newsItems.map(item => (
          <div key={item._id} className="news-card">
            <div className="news-card-content">
              <h3 className="news-card-title">
                {/* --- new route pattern --- */}
                <Link to={`/news/${item.department}/${item._id}`}>{item.title}</Link>
              </h3>

              <div className="news-card-meta">
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>{fmtDate(item.createdAt)} • {istClock(item.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <FaBuilding />
                  <span>{depts[item.department] || item.department}</span>
                </div>
              </div>

              {item.body && (
                <p className="news-card-description">
                  {item.body.length > 150
                    ? item.body.slice(0, 150) + '…'
                    : item.body}
                </p>
              )}

              <div className="news-card-footer">
                <Link
                  /* --- new route pattern here as well --- */
                  to={`/news/${item.department}/${item._id}`}
                  className="read-more-link"
                  state={location.pathname === '/admin' ? { fromAdmin: true } : undefined}
                >
                  Read More <FaAngleRight />
                </Link>

                <div className="attachment-count">
                  {item.files?.length ?? 0} attachment(s)
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <button
          className="pagination-btn"
          disabled={!hasNext}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsList;
