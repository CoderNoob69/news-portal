import { useState } from 'react';
import NewsList from '../News/NewsList';
import DepartmentList from '../Department/DepartmentList';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const AdminPage = ({ activeTab, setActiveTab }) => {
  return (
    <Box sx={{ p: { xs: 1, md: 3 }, background: 'background.default', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 1 }}>
            <CardContent>
              {activeTab === 'news' ? (
                <>
                  <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
                    Recent News
                  </Typography>
                  <NewsList />
                </>
              ) : (
                <DepartmentList />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;