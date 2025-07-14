import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUserAlt, FaBuilding } from 'react-icons/fa';
import './News.css';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call to fetch the news item
    // For demo purposes, we'll get it from localStorage
    try {
      const allNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
      const foundNews = allNews.find(item => item.id === id);
      
      if (foundNews) {
        setNewsItem(foundNews);
      } else {
        setError('News item not found');
      }
    } catch (err) {
      setError('Error loading news item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="news-detail-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="news-detail-container">
        <div className="error-message">{error || 'News item not found'}</div>
        <Link to="/department" className="back-link">
          <FaArrowLeft /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="news-detail-container">
      <div className="news-detail-card">
        <Link to="/department" className="back-link">
          <FaArrowLeft /> Back to News
        </Link>
        
        <div className="news-header">
          <h1 className="news-title">{newsItem.title}</h1>
          
          <div className="news-meta">
            <div className="meta-item">
              <FaCalendarAlt />
              <span>{formatDate(newsItem.date)}</span>
            </div>
            
            <div className="meta-item">
              <FaUserAlt />
              <span>{newsItem.author}</span>
            </div>
            
            <div className="meta-item">
              <FaBuilding />
              <span>{newsItem.department}</span>
            </div>
          </div>
        </div>
        
        {newsItem.description && (
          <div className="news-description">
            <p>{newsItem.description}</p>
          </div>
        )}
        
        {(newsItem.files.length > 0 || newsItem.driveLinks.length > 0) && (
          <div className="news-attachments">
            <h3>Attachments</h3>
            
            <ul className="attachment-list">
              {newsItem.files.map((file, index) => (
                <li key={`file-${index}`} className="attachment-item">
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
              
              {newsItem.driveLinks.map((link, index) => (
                <li key={`link-${index}`} className="attachment-item">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default NewsDetail;