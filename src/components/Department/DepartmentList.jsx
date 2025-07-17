import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Avatar, Typography, Box, IconButton } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DepartmentList = () => {
  const [depts, setDepts] = useState(null); // null = loading

  useEffect(() => {
    let abort = false;
    axios
      .get('http://localhost:4000/api/data/dept')
      .then(({ data }) => { if (!abort) setDepts(data); })
      .catch(err => {
        console.error(err);
        if (!abort) setDepts([]);
      });
    return () => { abort = true; };
  }, []);

  if (depts === null)
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">Loading departments</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} color="primary.main" align="center" sx={{ mb: 4 }}>
        Departments
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {depts.map(({ deptShort, deptLong }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={deptShort}>
            <Card
              component={Link}
              to={`/department/${encodeURIComponent(deptShort)}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: 6,
                },
                p: 2,
              }}
              tabIndex={0}
            >
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56, mr: 2 }}>
                <ApartmentIcon fontSize="large" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 0.5 }}>
                  {deptShort}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {deptLong}
                </Typography>
              </Box>
              <IconButton edge="end" size="large" sx={{ color: 'primary.main', ml: 1 }} tabIndex={-1}>
                <ChevronRightIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DepartmentList;
