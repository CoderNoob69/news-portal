import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewsList from '../News/NewsList';
import NewsUpload from '../News/NewsUpload';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';

const API_DEPTS = 'http://localhost:4000/api/data/dept';

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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)' }}>
        <Card elevation={8} sx={{ p: 4, borderRadius: 3, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h5" color="error" sx={{ fontWeight: 700, mb: 2 }}>
            No department selected. Please select a department from the admin page.
          </Typography>
        </Card>
      </Box>
    );
  }
  
  const activeDepartment = department || userDepartment;
  
  const [deptMap, setDeptMap] = useState({});
  useEffect(() => {
    axios.get(API_DEPTS)
      .then(({ data }) => {
        const map = {};
        data.forEach(d => { map[d.deptShort] = d.deptLong; });
        setDeptMap(map);
      })
      .catch(console.error);
  }, []);
  
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8e24aa 0%, #1976d2 100%)', py: 6 }}>
      <Card elevation={8} sx={{ maxWidth: 700, mx: 'auto', mb: 4, borderRadius: 3, boxShadow: 8 }}>
        <CardContent>
          <Typography variant="h2" color="primary" sx={{ fontWeight: 800, textAlign: 'center', fontSize: { xs: '1.7rem', sm: '2.3rem' }, letterSpacing: 0.5 }}>
            {deptMap[activeDepartment] || activeDepartment}
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ maxWidth: 700, mx: 'auto', bgcolor: 'white', borderRadius: 3, boxShadow: 6, p: { xs: 2, sm: 4 } }}>
        <ButtonGroup fullWidth variant="outlined" sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
          {isUserDepartment && (
            <Button
              variant={activeTab === 'upload' ? 'contained' : 'outlined'}
              color={activeTab === 'upload' ? 'primary' : 'inherit'}
              sx={{ fontWeight: 700, borderRadius: 2, fontSize: '1.08rem' }}
              onClick={() => setActiveTab('upload')}
            >
              Upload News
            </Button>
          )}
        </ButtonGroup>
        {activeTab === 'news' ? (
          <NewsList departmentFilter={activeDepartment} />
        ) : (
          <NewsUpload />
        )}
      </Box>
    </Box>
  );
};

export default DepartmentPage;