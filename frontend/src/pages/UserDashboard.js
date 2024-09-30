import React, { useEffect, useState } from 'react';
import { Avatar, Box, Tabs, Tab, Typography, Container, CssBaseline, Card, CardContent, LinearProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PendingIcon from '@mui/icons-material/Pending';
import { getStudySets } from '../apiService';
import QuestionsUserDashboard from '../components/QuestionsUserDashboard';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';

function UserDashboard() {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(true); // true is the user dash
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [done, setDone] = useState(true)

  useEffect(() => {
    const retrieveSets = async () => {
      const response = await getStudySets()
      if (response.status === 200) {
        setSets(response.data.transcripts)
      }
    }
    retrieveSets()
  }, [done]);

  const handleDone = async () => {
    setDone(!done)
  }

  const handlePageChange = async () => {
    setPage(!page)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardClick = (i) => {
    setSelectedSet(sets[i])
  };

  const renderQuestionSets = () => {
    const questionSets = [];

    const progressData = [];


    for (let i = 0; i < sets.length; i++) {
      let complete = 0
      for (let j = 0; j < sets[i].questions.length; j++) {
        if (sets[i].questions[j].complete) {
          complete++
        }
      }
      progressData.push(Math.round((complete / sets[i].questions.length) * 100))
    }

    for (let i = 0; i < sets.length; i++) {
      questionSets.push(
        <Grid size={{ md: 4, xs: 12 }} key={i}>
          <Card
            variant="outlined"
            onClick={() => {
              handlePageChange()
              handleCardClick(i)
            }}
            sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              width: '100%',
              height: 200,
              borderRadius: 10,
              marginBottom: 5
            }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6">{sets[i].title}</Typography>


              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body21" sx={{ mr: 2 }}>
                  {`${progressData[i]}%`}
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
                    value={progressData[i]}
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
    <>
      {page ?
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 25 }}>
          <CssBaseline />
          <Avatar sx={{ width: 120, height: 120, mb: 3 }} />


          <Tabs
            value={value}
            onChange={handleChange}
            centered
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#ff8463",
              },
            }}
          >
            <Tab label="Saved Questions" sx={{ fontWeight: 700, fontSize: 15 }} />
            <Tab label="Achievements" sx={{ fontWeight: 700, fontSize: 15 }} />
          </Tabs>


          <Box sx={{ width: '100%', textAlign: 'center' }}>
            {value === 0 && (
              <>
                <Grid container spacing={3} sx={{ mt: 5 }}>
                  {renderQuestionSets()}
                </Grid>
                <Fab
                  sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                  }}
                  onClick={() => alert('Floating Action Button Clicked')}
                >
                  <EditIcon />
                </Fab>
              </>
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
        :
        <QuestionsUserDashboard back={handlePageChange} set={selectedSet} handleDone={handleDone} />
      }
    </>
  );
}

export default UserDashboard;
