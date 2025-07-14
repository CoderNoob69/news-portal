import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUserAlt, FaAngleRight, FaBuilding } from 'react-icons/fa';
import './News.css';

const NewsList = ({ departmentFilter = null }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { department } = useParams();
  const location = useLocation();
  
  // Use department from URL params if provided, otherwise use the prop
  const activeDepartment = department || departmentFilter;
  
  // Always show 10 items per page
  const itemsPerPage = 10;

  useEffect(() => {
    // In a real app, this would be an API call to fetch news items
    // For demo purposes, we'll get them from localStorage
    try {
      let allNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
      
      // Filter by department if specified
      if (activeDepartment) {
        allNews = allNews.filter(item => item.department === activeDepartment);
      }
      
      // Sort by date (newest first)
      allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setNewsItems(allNews);
    } catch (err) {
      setError('Error loading news items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeDepartment]);

  // Calculate pagination
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = newsItems.slice(startIndex, endIndex);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (newsItems.length === 0) {
    return (
      <div className="no-news-message">
        {activeDepartment ? 
          `No news available for ${activeDepartment}` : 
          'No news available'}
      </div>
    );
  }

  return (
    <div className="news-list-container">
      {activeDepartment && (
        <h2 className="department-heading">{activeDepartment} News</h2>
      )}
      
      <div className="news-list">
        {currentItems.map((item) => (
          <div key={item.id} className="news-card">
            <div className="news-card-content">
              <h3 className="news-card-title">
                <Link to={`/news/${item.id}`}>{item.title}</Link>
              </h3>
              
              <div className="news-card-meta">
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>{formatDate(item.date)} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="meta-item">
                  <FaBuilding />
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
                <Link
                  to={`/news/${item.id}`}
                  className="read-more-link"
                  state={location.pathname === '/admin' ? { fromAdmin: true } : undefined}
                >
                  Read More <FaAngleRight />
                </Link>
                
                <div className="attachment-count">
                  {item.files.length + item.driveLinks.length} attachment(s)
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsList;