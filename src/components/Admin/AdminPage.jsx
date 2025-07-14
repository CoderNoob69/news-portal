import { useState } from 'react';
import NewsList from '../News/NewsList';
import DepartmentList from '../Department/DepartmentList';
import './Admin.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            Recent News
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            Departments
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        {activeTab === 'news' ? (
          <div className="admin-section">
            <h2>Recent News from All Departments</h2>
            <NewsList />
          </div>
        ) : (
          <div className="admin-section">
            <DepartmentList />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;