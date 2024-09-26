import React, { useState } from 'react';
import { Avatar, Box, Tabs, Tab, Typography, Container, CssBaseline, Card, CardContent, LinearProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PendingIcon from '@mui/icons-material/Pending';

function UserDashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderQuestionSets = () => {
    const questionSets = [];
    
    // Simulate different progress for each question set
    const progressData = [20, 45, 75, 50, 90, 60, 30, 85, 40, 70];
    
    for (let i = 1; i <= 10; i++) {
      questionSets.push(
        <Grid size={{md : 4, xs : 12}} key={i}>
            <Card variant="outlined" sx={{ 
                transition: 'transform 0.3s ease-in-out', // Smooth transition
                '&:hover': {
                  transform: 'scale(1.1)', // Slightly expand the card
                },
                width: '100%', 
                height: 200, 
                borderRadius: 10, 
                marginBottom: 5 
            }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6">Question Set {i}</Typography>

              {/* Centered Progress bar and percentage */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body21" sx={{ mr: 2 }}>
                  {`${progressData[i - 1]}%`}
                </Typography>
                <Box sx={{ width: '20%' }}>
                    <LinearProgress 
                        sx={{
                            height: 10,
                            borderRadius: 10,
                            backgroundColor: '#686868',
                            '& .MuiLinearProgress-bar': {
                            backgroundColor: '#ff8463'
                            }
                        }}
                        variant="determinate" 
                        value={progressData[i - 1]} 
                    />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    }
    return questionSets;
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 25 }}>
      <CssBaseline />
      <Avatar sx={{ width: 120, height: 120, mb: 3 }} />

      {/* Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        textColor="white"
        TabIndicatorProps={{
          style: {
            backgroundColor: "#ff8463",
          },
        }}
      >
        <Tab label="Saved Questions" sx={{ fontWeight: 700, fontSize: 15 }} />
        <Tab label="Achievements" sx={{ fontWeight: 700, fontSize: 15 }} />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        {value === 0 && (
          <Grid container spacing={3} sx={{ mt: 5 }}>
            {renderQuestionSets()}
          </Grid>
        )}
        {value === 1 && (
          <>
            <Typography variant="h5" marginTop={5} color="#555151">
              This feature is coming soon!
            </Typography>
            <PendingIcon sx={{ fontSize: 80, opacity: 0.2, mt: 5 }} />
          </>
        )}
      </Box>
    </Container>
  );
}

export default UserDashboard;
