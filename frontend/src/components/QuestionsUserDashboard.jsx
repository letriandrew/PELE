import { Button, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';
import { handleQuestionComplete } from '../apiService';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';



// Used in Record.js
export default function QuestionsUserDashboard({ back, set, handleDone }) {

    const [checked, setChecked] = useState(Array(set.questions.length).fill(false));
    const [handle, setHandle] = useState(Array(set.questions.length).fill(false));
    const [cardView, setCardView] = useState(1); // 1 is the multiple card layout, 2 is single card view
    const [cardIndex, setCardIndex] = useState(0);
    const [hideTranscript, setHideTranscript] = useState(false);

    useEffect(() => {
        const newChecked = []
        for (let i = 0; i < set.questions.length; i++) {
            newChecked.push(set.questions[i].complete)
        }
        setChecked(newChecked)

    }, []);


    const handleCheck = (index) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);

        const newhandle = [...handle];
        newhandle[index] = !newhandle[index];
        setHandle(newhandle);
    };

    const handleRequest = async () => {
        const id_list = []
        for (let i = 0; i < handle.length; i++) {
            if (handle[i]) {
                id_list.push(set.questions[i].id)
            }
        }
        if (id_list.length > 0) {
            console.log(id_list)
            const response = await handleQuestionComplete(id_list)
            handleDone()
        }
    }

    const handleViewChangeMultiple = () => {
        setCardView(1);
    }

    const handleViewChangeSingle = () => {
        setCardView(2);
    }

    const handleLeft = () =>{
        if(cardIndex > 0){
            setCardIndex(cardIndex-1);
        }
    }

    const handleRight = () =>{
        if(cardIndex < set.questions.length-1){
            setCardIndex(cardIndex+1)
        }
    }
    
    const handleHideTranscript = () => {
        setHideTranscript(!hideTranscript)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '100px',
                paddingBottom: '100px',
                minHeight: '100vh'
            }}
        >
            <CssBaseline />

            {!hideTranscript &&
            <Card
                variant="outlined"
                sx={{
                    width: '80%',
                    marginBottom: 5,
                    padding: 3,
                    mt: 10,
                    backgroundColor: '#3A394E'
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
            }

            <Button 
                color='inherit' 
                sx = {{mb:1,mt:1}}
                onClick={handleHideTranscript}
            >
                { hideTranscript ?
                    <>
                    <KeyboardArrowDownIcon/>
                    <Typography sx={{fontSize:12}}>Show Transcript</Typography>
                    </>
                    :
                    <>
                    <KeyboardArrowUpIcon/>
                    <Typography sx={{fontSize:12}}>Hide Transcript</Typography>
                    </>
                }
            </Button>

            <Box spacing={2}>
                <IconButton
                    onClick={handleViewChangeMultiple}
                >
                    <ViewModuleIcon
                        sx={{
                            fontSize: 30,
                            opacity: cardView === 1 ? 1 : 0.3
                        }}
                    />
                </IconButton>
                <IconButton
                    onClick={handleViewChangeSingle}
                >
                    <ViewCarouselIcon
                        sx={{
                            fontSize: 30,
                            opacity: cardView === 2 ? 1 : 0.3
                        }}
                    />
                </IconButton>
            </Box>

            {cardView === 1 &&
                <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 5, width: '80%' }}>
                    {
                        set.questions.map((i, index) => (
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
                                        <IconButton
                                            onClick={() =>
                                                handleCheck(index)
                                            }>
                                            {checked[index] ? (
                                                <CheckCircleIcon color="success" sx={{ fontSize: 30 }} />  // Filled checkmark if checked
                                            ) : (
                                                <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />  // Outlined checkmark if not checked
                                            )}
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            }
            {cardView === 2 &&
                <Box
                    sx = {{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <IconButton 
                        sx={{
                            p:{
                                xs: 1,
                                sm: 2
                            }
                        }}
                        disabled={cardIndex === 0}
                        onClick={handleLeft}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>

                    <Card
                        sx={{
                            width: {
                                xs: '75vw',
                                sm: '40vw'
                            },
                            height: {
                                xs: '40vh',
                                sm: '50vh'
                            }
                        }}
                    >

                        <CardContent>
                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                Question {cardIndex + 1}
                            </Typography>
                            <Typography variant="body2">
                                {set.questions[cardIndex].question}
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
                            <IconButton
                                onClick={() =>
                                    handleCheck(cardIndex)
                                }>
                                {checked[cardIndex] ? (
                                    <CheckCircleIcon color="success" sx={{ fontSize: 30 }} />  // Filled checkmark if checked
                                ) : (
                                    <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />  // Outlined checkmark if not checked
                                )}
                            </IconButton>
                        </Box>
                    </Card>
                    <IconButton
                        sx={{
                            p:{
                                xs: 1,
                                sm: 2
                            }
                        }}
                        disabled={cardIndex === set.questions.length-1}
                        onClick={handleRight}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Box>
            }


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
                    onClick={() => {
                        handleRequest()
                        back()
                    }}
                >
                    <Typography fontWeight={550}>Back To Dashboard</Typography>
                </Button>
            </Box>
        </Box>
    );
}
