import { Button, Typography, Box, Card, CardContent, Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { useAudioContext } from '../context/AudioContext';
import SaveSetDialog from './SaveSetDialog'; // Import the Dialog component
import { saveStudySet } from '../apiService'
import Notification from './Notification';

export default function Questions({ handleDelete, handlePage }) {
  const { processedAudioResponse } = useAudioContext();
  const questions = processedAudioResponse?.questions || [];
  const transcript = processedAudioResponse?.transcript || null;

  const [openDialog, setOpenDialog] = useState(false);
  const [setTitle, setSetTitle] = useState(''); // State for the set title
  const [notification, setNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationStatus, setNotificationStatus] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCloseNotification = () => {
    setNotification(false)
  }

  const handleOpenNotification = () => {
    setNotification(true)
  }

  const handleSave = async (title) => {
    setSetTitle(title);
    const response = await saveStudySet(title, processedAudioResponse.transcript, processedAudioResponse.questions);
    console.log(response);
    if (response.status === 200) {
      setNotificationStatus(true)
      setNotificationMessage("Study set saved to dashboard")
      setSaved(true)
    }
    else {
      setNotificationStatus(false)
      setNotificationMessage("Failed to save study set")
    }
    handleOpenNotification();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '100px',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />

      <Box
        sx={{
          flexGrow: 1,
          width: {
            xs: '90%', // For small screens (mobile), take up 90% of the screen width
            sm: '60%', // For larger screens (tablet and up), use fit-content
          },
          display: 'flex',
          justifyContent: 'center'
        }}>
        <Box container spacing={2} sx={{ mt: 10 }}>
          {transcript && (
            <Card
              sx={{
                mb: 3,
                display: 'block',
                width: 'fit-content',
                maxWidth: '100%',
                justifyContent: 'right',
                backgroundColor: '#2f2e44',
              }}
            >
              <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Your Transcript
                </Typography>
                <Typography variant="body2">{transcript}</Typography>
              </CardContent>
            </Card>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 6 }}>
            <Avatar sx={{ width: 30, height: 30 }} />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              PELE Bot
            </Typography>
          </Box>

          {questions.length > 0 ? (
            <>
              {
                questions.map((question, index) => (
                  <Card
                    key={index}
                    sx={{
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                      mb: 3,
                      ml: 1,
                      display: 'block',
                      width: 'fit-content',
                      maxWidth: '100%',
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Question {index + 1}
                      </Typography>
                      <Typography variant="body2">{question}</Typography>
                    </CardContent>
                  </Card>
                ))
              }
              <Box sx={{ width: '100%', textAlign: 'center', pb: 5, mt: 5 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                    },
                    mr: 2,
                  }}
                  onClick={() => {
                    handleDelete()
                    handlePage(0)
                  }}
                >
                  <Typography fontWeight={550}>Back To Recording</Typography>
                </Button>

                <Button
                  variant="contained"
                  disabled={saved}
                  sx={{
                    background: 'linear-gradient(45deg, #3A394E 30%, #4d4c70 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4d4c70 30%, #3A394E 90%)',
                    },
                    mt: {
                      xs: 2,
                      sm: 0
                    },
                    mr:{
                      xs: 2,
                      sm: 0
                    }
                  }}
                  onClick={handleDialogOpen} // Open the dialog on click
                >
                  <Typography fontWeight={550}>Save As Study Set</Typography>
                </Button>
              </Box>
            </>


          ) : (
            <Typography variant="body2">
              {processedAudioResponse ? 'No questions available' : 'Processing audio, please wait...'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Dialog Component */}
      <SaveSetDialog open={openDialog} handleClose={handleDialogClose} handleSave={handleSave} />
      {notification &&
        <Notification message={notificationMessage} status={notificationStatus} close={handleCloseNotification} />
      }
    </Box>
  );
}
