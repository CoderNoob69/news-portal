import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBuilding, FaAngleRight } from 'react-icons/fa';
import './Department.css';

const DepartmentList = () => {
  const [depts, setDepts] = useState(null);      // null = loading

  /* fetch once on mount */
  useEffect(() => {
    let abort = false;
    axios
      .get('http://localhost:4000/api/data/dept')
      .then(({ data }) => { if (!abort) setDepts(data); })
      .catch(err => {
        console.error(err);
        if (!abort) setDepts([]);               // show “no departments”
      });
    return () => { abort = true; };
  }, []);

  /* loading state */
  if (depts === null)
    return <div className="department-list-container">Loading departments…</div>;

  return (
    <div className="department-list-container">
      <h2>Departments</h2>

      <div className="department-grid">
        {depts.map(({ deptShort, deptLong }) => (
          <Link
            to={`/department/${encodeURIComponent(deptShort)}`}
            key={deptShort}
            className="department-card"
          >
            <div className="department-icon">
              <FaBuilding />
            </div>

            <div className="department-info">
              <h3>{deptShort}</h3>
              <p>{deptLong}</p>
            </div>

            <div className="department-arrow">
              <FaAngleRight />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;
