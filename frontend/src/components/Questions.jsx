import { Button, Typography, Box, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import { useAudioContext } from '../context/AudioContext';

// Used in Record.js
export default function Questions({ back }) {
  const { processedAudioResponse } = useAudioContext(); // Access processed audio response

  // Safely access the list of questions from processedAudioResponse
  const questions = processedAudioResponse?.questions || [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '100px',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />

      <Grid container spacing={2} sx={{ marginTop: 5, width: '80%' }}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <Grid
              key={index}
              item // Use `item` for individual grid items
              xs={12} md={4}  // Adjusted grid size for better card layout
            >
              <Card
                sx={{
                  transition: 'transform 0.3s ease-in-out', // Smooth transition
                  '&:hover': {
                    transform: 'scale(1.1)', // Slightly expand the card on hover
                  },
                }}
              >
                <CardContent>
                  <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body2">
                    {question} {/* Render each question separately */}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2">
            {processedAudioResponse
              ? "No questions available"
              : "Processing audio, please wait..."}
          </Typography>
        )}
      </Grid>

      <Box sx={{ padding: '50px' }}>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
            },
          }}
          onClick={back}
        >
          <Typography fontWeight={550}>Back To Recording</Typography>
        </Button>
      </Box>
    </Box>
  );
}
