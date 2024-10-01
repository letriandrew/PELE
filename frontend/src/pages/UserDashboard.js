import React, { useEffect, useState } from 'react';
import { Avatar, Box, Tabs, Tab, Typography, Container, CssBaseline, Card, CardContent, LinearProgress, IconButton, TextField, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PendingIcon from '@mui/icons-material/Pending';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStudySets } from '../apiService';
import QuestionsUserDashboard from '../components/QuestionsUserDashboard';
import { deleteStudySet } from '../apiService';

function UserDashboard() {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(true); // true is the user dash
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [done, setDone] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // For menu
  const [editIndex, setEditIndex] = useState(null); // Track which set is being edited

  useEffect(() => {
    const retrieveSets = async () => {
      const response = await getStudySets();
      if (response.status === 200) {
        setSets(response.data.transcripts);
        console.log(response.data.transcripts)
      }
    };
    retrieveSets();
  }, [done]);

  const handleDone = async () => {
    setDone(!done);
  };

  const handlePageChange = async () => {
    setPage(!page);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardClick = (i) => {
    setSelectedSet(sets[i]);
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setEditIndex(index); // Set the current set being edited
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    console.log('edit click')
    setAnchorEl(null);
    setEditIndex(editIndex); // Track the index of the editable set
  };

  const handleDeleteClick = async (del) => {
    console.log('delete click' , del)
    const response = await deleteStudySet(sets[del].id)
    if (response.status === 200){
      const updatedSets = sets.filter((_, i) => i !== del);
      setSets(updatedSets);
      console.log("deletion success: ",response)
    }
    else{
      // do notification
      console.log("error: ",response)
    }
    setAnchorEl(null);
  };

  const handleEditChange = (event, i) => {
    const updatedSets = [...sets];
    updatedSets[i].title = event.target.value;
    setSets(updatedSets);
  };

  const handleEditBlur = () => {
    console.log("HUHHH")
    setEditIndex(null); // Exit edit mode
  };

  const renderQuestionSets = () => {
    const questionSets = [];
    const progressData = [];

    for (let i = 0; i < sets.length; i++) {
      let complete = 0;
      for (let j = 0; j < sets[i].questions.length; j++) {
        if (sets[i].questions[j].complete) {
          complete++;
        }
      }
      progressData.push(Math.round((complete / sets[i].questions.length) * 100));
    }

    for (let i = 0; i < sets.length; i++) {
      questionSets.push(
        <Grid size={{ md: 4, xs: 12 }} key={i}>
          <Card
            variant="outlined"
            onClick={() => {
              handlePageChange();
              handleCardClick(i);
            }}
            sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              width: '100%',
              height: 200,
              borderRadius: 10,
              marginBottom: 5,
              position: 'relative'
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              
                <Typography variant="h6">{sets[i].title}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {`${progressData[i]}%`}
                </Typography>
                <Box sx={{ width: '20%' }}>
                  <LinearProgress
                    sx={{
                      height: 10,
                      borderRadius: 10,
                      backgroundColor: '#686868',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ff8463',
                      },
                    }}
                    variant="determinate"
                    value={progressData[i]}
                  />
                </Box>
              </Box>

              {/* Icon Button for Menu */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();  // Prevent the card's onClick from firing
                  handleMenuOpen(e, i);
                }}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <MoreVertIcon />
              </IconButton>

              {/* Menu for Edit/Delete */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={(e) => {
                  e.stopPropagation();  // Prevent card click when closing the menu
                  handleMenuClose();
                }}
              >
                {/* <MenuItem onClick={ (e) =>{
                  e.stopPropagation();
                  handleEditClick()
                }}>
                  <EditIcon sx={{ marginRight: 1 }} /> Edit
                </MenuItem> */}
                <MenuItem onClick={ (e) =>{
                  e.stopPropagation();
                  handleDeleteClick(editIndex)
                }}>
                  <DeleteIcon sx={{ marginRight: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Grid>
      );
    }

    if (questionSets.length === 0) {
      return (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" marginTop={5} color="#555151">
            No question sets saved
          </Typography>
          <PendingIcon sx={{ fontSize: 80, opacity: 0.2, mt: 5 }} />
        </Box>
      );
    } else {
      return questionSets;
    }
  };

  return (
    <>
      {page ? (
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
                backgroundColor: '#ff8463',
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
              </>
            )}
            {value === 1 && (
              <>
                <Typography variant="h5" marginTop={10} color="#555151">
                  This feature is coming soon!
                </Typography>
                <BuildIcon sx={{ fontSize: 80, opacity: 0.2, mt: 5 }} />
              </>
            )}
          </Box>
        </Container>
      ) : (
        <QuestionsUserDashboard back={handlePageChange} set={selectedSet} handleDone={handleDone} />
      )}
    </>
  );
}

export default UserDashboard;
