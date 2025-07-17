import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaAngleLeft, FaBuilding } from 'react-icons/fa';
import { filterNewsByDateAndDept } from './NewsList';
import './News.css';

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
    <div className="admin-news-detail-container">
      <button className="admin-news-back-btn" onClick={() => navigate(-1)}>
        <FaAngleLeft /> Back to summary
      </button>
      <h2 className="admin-news-detail-heading">
        {date} — {depts[department] || department} Department
      </h2>
      {loading ? (
        <div className="flex-center admin-news-loading">Loading…</div>
      ) : error ? (
        <div className="flex-center admin-news-error">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="admin-news-empty-card">
          <h3>No news found for this group.</h3>
        </div>
      ) : (
        <div className="admin-news-list-cards">
          {filtered.map(item => (
            <div key={item._id} className="admin-news-card">
              <h3 className="admin-news-title">{item.title}</h3>
              <div className="admin-news-meta"><FaBuilding style={{ marginRight: 4 }} /> {depts[item.department] || item.department}</div>
              {item.body && (
                <div className="admin-news-body">
                  {item.body.length > 150 ? item.body.slice(0, 150) + '…' : item.body}
                </div>
              )}
              <div className="admin-news-attachments">
                <span>{item.files?.length ?? 0} attachment(s)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 