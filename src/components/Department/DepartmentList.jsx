import { Link } from 'react-router-dom';
import { FaBuilding, FaAngleRight } from 'react-icons/fa';
import './Department.css';

const DepartmentList = () => {
  const departments = [
    'Computer Science and Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical Engineering (Elec)',
    'Mechanical Engineering (Mech)',
    'Chemical Engineering (Chem)',
    'Mineral and Metallurgical Engineering (Meta)',
    'Civil Engineering (Civil)',
    'Biotech Engineering (BTE)',
    'Biomed Engineering (BME)',
    'Architecture (Arch)'
  ];

  // Function to get the count of news items for each department
  const getNewsCount = (department) => {
    try {
      const allNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
      return allNews.filter(item => item.department === department).length;
    } catch (err) {
      console.error('Error getting news count:', err);
      return 0;
    }
  };

  return (
    <div className="department-list-container">
      <h2>Departments</h2>
      
      <div className="department-grid">
        {departments.map((department, index) => {
          const newsCount = getNewsCount(department);
          const shortName = department.split('(')[1]?.replace(')', '') || department;
          
          return (
            <Link 
              to={`/department/${encodeURIComponent(department)}`} 
              key={index}
              className="department-card"
            >
              <div className="department-icon">
                <FaBuilding />
              </div>
              
              <div className="department-info">
                <h3>{shortName}</h3>
                <p>{department}</p>
                <div className="news-count">{newsCount} news item(s)</div>
              </div>
              
              <div className="department-arrow">
                <FaAngleRight />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentList;