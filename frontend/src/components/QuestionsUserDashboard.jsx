import { Button, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';

// Used in Record.js
export default function QuestionsUserDashboard({ back, set }) {

    const [checked, setChecked] = useState(Array(set.questions.length).fill(false));

    // Handle the toggle between checked and unchecked
    const handleCheck = (index) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];  // Toggle the check state
        setChecked(newChecked);
    };

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
            <Card
                variant="outlined"
                sx={{
                    width: '80%',
                    marginBottom: 5,
                    padding: 3,
                    mt: 10
                }}
            >
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Transcript:
                    </Typography>
                    <Typography variant="body1">
                        {set.transcript}
                    </Typography>
                </CardContent>
            </Card>

            <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 5, width: '80%' }}>
                {set.questions.map((i, index) => (
                    <Grid
                        key={index}
                        size={{
                            xs: 12, md: 2.4
                        }}
                    >
                        <Card
                            sx={{
                                transition: 'transform 0.3s ease-in-out', // Smooth transition
                                '&:hover': {
                                    transform: 'scale(1.1)', // Slightly expand the card
                                },
                            }}
                        >
                            <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    Question {index + 1}
                                </Typography>
                                <Typography variant="body2">
                                    {i.question}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginTop: 'auto'  // Push the icon to the bottom of the card content
                                }}
                            >
                                <IconButton onClick={() => handleCheck(index)}>
                                    {checked[index] ? (
                                        <CheckCircleIcon color="success" />  // Filled checkmark if checked
                                    ) : (
                                        <CheckCircleOutlineIcon />  // Outlined checkmark if not checked
                                    )}
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
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
                    <Typography fontWeight={550}>Back To Dashboard</Typography>
                </Button>
            </Box>
        </Box>
    );
}
