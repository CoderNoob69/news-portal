import { useState } from 'react';
import NewsList from '../News/NewsList';
import DepartmentList from '../Department/DepartmentList';
import './Admin.css';

const AdminPage = ({ activeTab, setActiveTab }) => {

  return (
    <div className="admin-page">

      <div className="admin-content">
        {activeTab === 'news' ? (
          <div className="admin-section">
            <h2>Recent News</h2>
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