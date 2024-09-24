import * as React from 'react';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

function Copyright() {
  return (
    <Typography variant="body2">
      {'Copyright © '}
      <Link color="inherit" href="https://www.youtube.com/watch?v=98BMrRXvRjc">
        PELE INC
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Project PELE';

  useEffect(() => {
    let index = 0;
    const typingSpeed = 150; // Typing speed in ms

    const typeText = () => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
        setTimeout(typeText, typingSpeed);
      }
    };

    typeText();

    return () => {
      index = fullText.length;
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component="main" sx={{ mt: 35, textAlign: 'center' }} maxWidth="sm">
        <Typography 
        variant="h3"
        sx={{
          background: 'linear-gradient(45deg, #545050 30%, #b2b2b2 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        >
          Welcome to,
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          {typedText}

        </Typography>

        <Typography variant="h5" component="h2" gutterBottom marginBottom={10} >
          {'PELE aka the Protégé Effect Learning Entity is an application to assist in learning by invoking the Protégé Effect.'}
        </Typography>

        {/* Button Group */}
        
            <Button
              variant="contained"
              href='/signUp'
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                },
              }}>
              <Typography sx={{fontWeight: 600, letterSpacing: '0.1rem'}}>
                Get Started
              </Typography>
            </Button>
      
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
            PELE
          </Typography>
          <Copyright />
        </Container>
      </Box>
    </Box>
  );
}
