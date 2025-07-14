import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewsList from '../News/NewsList';
import NewsUpload from '../News/NewsUpload';
import './Department.css';

const DepartmentPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const { department } = useParams();
  const navigate = useNavigate();
  
  // Get user department from localStorage (in a real app, this would come from an API)
  const userDepartment = localStorage.getItem('userBranch');
  
  // If no department is specified in the URL, use the user's department
  useEffect(() => {
    if (!department && userDepartment) {
      navigate(`/department/${encodeURIComponent(userDepartment)}`);
    }
  }, [department, userDepartment, navigate]);
  
  // Determine if the current user belongs to this department
  const isUserDepartment = department === userDepartment;
  
  // If no department is found, show a message
  if (!department && !userDepartment) {
    return (
      <div className="department-page">
        <div className="error-message">
          No department selected. Please select a department from the admin page.
        </div>
      </div>
    );
  }
  
  const activeDepartment = department || userDepartment;
  
  return (
    <div className="department-page">
      <div className="department-header">
        <h1>{activeDepartment}</h1>
      </div>
      
      <div className="department-content">
        <div className="department-tabs">
          <button 
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            Recent News
          </button>
          
          {isUserDepartment && (
            <button 
              className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload News
            </button>
          )}
        </div>
        
        {activeTab === 'news' ? (
          <NewsList departmentFilter={activeDepartment} />
        ) : (
          <NewsUpload />
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;