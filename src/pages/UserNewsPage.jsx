import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaFileImage, FaFilePdf, FaFileVideo, FaFileAlt, FaGoogleDrive } from 'react-icons/fa';
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

  const [userNews, setUserNews] = useState(filterUserNews());

  // Delete handler
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this news post?')) return;
    try {
      const allNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
      const updatedNews = allNews.filter(item => item.id !== id);
      localStorage.setItem('newsItems', JSON.stringify(updatedNews));
      setUserNews(userNews.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete news item.');
    }
  };
  
  return (
    <div className="user-news-page">
      <div className="user-news-header">
        <h1>My News Posts</h1>
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
                    
                    <div className="news-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Link to={`/news/${item.id}`} className="read-more-link">
                          View Details
                        </Link>
                        <div className="attachment-count">
                          {item.files.length + item.driveLinks.length} attachment(s)
                        </div>
                        {/* Attachment list with icons */}
                        {(item.files.length > 0 || item.driveLinks.length > 0) && (
                          <ul className="attachment-list" style={{ marginTop: '0.5rem', paddingLeft: 0 }}>
                            {item.files.map((file, idx) => {
                              let icon = <FaFileAlt style={{ color: '#1a237e', marginRight: 6 }} />;
                              if (file.type && file.type.startsWith('image/')) icon = <FaFileImage style={{ color: '#43a047', marginRight: 6 }} />;
                              else if (file.type === 'application/pdf') icon = <FaFilePdf style={{ color: '#e53935', marginRight: 6 }} />;
                              else if (file.type && file.type.startsWith('video/')) icon = <FaFileVideo style={{ color: '#3949ab', marginRight: 6 }} />;
                              return (
                                <li key={`file-${idx}`} className="attachment-item" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', marginBottom: 2 }}>
                                  {icon}
                                  <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e', textDecoration: 'underline' }}>{file.name}</a>
                                </li>
                              );
                            })}
                            {item.driveLinks.map((link, idx) => (
                              <li key={`drive-${idx}`} className="attachment-item" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', marginBottom: 2 }}>
                                <FaGoogleDrive style={{ color: '#0f9d58', marginRight: 6 }} />
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1a237e', textDecoration: 'underline' }}>{link.name}</a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button 
                        className="remove-file-btn" 
                        title="Delete this news post"
                        onClick={() => handleDelete(item.id)}
                        style={{ marginLeft: '1rem' }}
                      >
                        <FaTrash />
                      </button>
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