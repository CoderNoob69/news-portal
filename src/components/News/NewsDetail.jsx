import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUserAlt, FaBuilding, FaFileImage, FaFilePdf, FaFileVideo, FaFileAlt, FaGoogleDrive } from 'react-icons/fa';
import './News.css';

const NewsDetail = () => {
  const { id } = useParams();
  const location = useLocation();
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

  // Determine where to go back: /admin (home) or /department
  const backTo = location.state && location.state.fromAdmin ? '/admin' : '/department';
  const backText = location.state && location.state.fromAdmin ? 'Back to Home' : 'Back to News';

  if (error || !newsItem) {
    return (
      <div className="news-detail-container">
        <div className="error-message">{error || 'News item not found'}</div>
        <Link to={backTo} className="back-link">
          <FaArrowLeft /> {backText}
        </Link>
      </div>
    );
  }

  return (
    <div className="news-detail-container">
      <div className="news-detail-card">
        <Link to={backTo} className="back-link">
          <FaArrowLeft /> {backText}
        </Link>
        
        <div className="news-header">
          <h1 className="news-title">{newsItem.title}</h1>
          
          <div className="news-meta">
            <div className="meta-item">
              <FaCalendarAlt />
              <span>{formatDate(newsItem.date)}</span>
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
              {newsItem.files.map((file, index) => {
                let icon = <FaFileAlt style={{ color: '#1a237e', marginRight: 6 }} />;
                if (file.type && file.type.startsWith('image/')) icon = <FaFileImage style={{ color: '#43a047', marginRight: 6 }} />;
                else if (file.type === 'application/pdf') icon = <FaFilePdf style={{ color: '#e53935', marginRight: 6 }} />;
                else if (file.type && file.type.startsWith('video/')) icon = <FaFileVideo style={{ color: '#3949ab', marginRight: 6 }} />;
                return (
                  <li key={`file-${index}`} className="attachment-item" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', marginBottom: 2 }}>
                    {icon}
                    <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e', textDecoration: 'underline' }}>{file.name}</a>
                  </li>
                );
              })}
              
              {newsItem.driveLinks.map((link, index) => (
                <li key={`link-${index}`} className="attachment-item" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', marginBottom: 2 }}>
                  <FaGoogleDrive style={{ color: '#0f9d58', marginRight: 6 }} />
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e', textDecoration: 'underline' }}>{link.name}</a>
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