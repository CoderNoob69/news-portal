import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import NewsList from '../components/News/NewsList';

const UserNewsPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/');
    } else {
      setUserEmail(localStorage.getItem('userEmail') || '');
    }
  }, [navigate]);
  
  // Filter news items by the current user
  const filterUserNews = () => {
    try {
      const allNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
      return allNews.filter(item => {
        // In a real app, this would be a more reliable user ID check
        return item.author === localStorage.getItem('userName');
      });
    } catch (err) {
      console.error('Error filtering user news:', err);
      return [];
    }
  };
  
  const userNews = filterUserNews();
  
  return (
    <div className="user-news-page">
      <div className="user-news-header">
        <h1>Your News Posts</h1>
        <Link to="/post" className="add-news-btn">
          <FaPlus /> Post New
        </Link>
      </div>
      
      <div className="user-news-content">
        {userNews.length > 0 ? (
          <div className="news-list-container">
            <div className="news-list">
              {userNews.map((item) => (
                <div key={item.id} className="news-card">
                  <div className="news-card-content">
                    <h3 className="news-card-title">
                      <Link to={`/news/${item.id}`}>{item.title}</Link>
                    </h3>
                    
                    <div className="news-card-meta">
                      <div className="meta-item">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="meta-item">
                        <span>{item.department}</span>
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="news-card-description">
                        {item.description.length > 150 
                          ? `${item.description.substring(0, 150)}...` 
                          : item.description}
                      </p>
                    )}
                    
                    <div className="news-card-footer">
                      <Link to={`/news/${item.id}`} className="read-more-link">
                        View Details
                      </Link>
                      
                      <div className="attachment-count">
                        {item.files.length + item.driveLinks.length} attachment(s)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-news-message">
            You haven't posted any news yet. 
            <Link to="/post">Create your first post</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNewsPage;