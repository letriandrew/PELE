import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://www.youtube.com/watch?v=98BMrRXvRjc">
        PELE INC
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Home() {
  return (
    <ThemeProvider theme={defaultTheme}>
        
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '95vh',
        }}
      >
        <CssBaseline />
        <Container component="main" sx={{ mt: 8}} maxWidth="sm" >
            <Typography variant="h2" component="h1" gutterBottom>
                Project PELE
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom marginBottom={10}>
                {'PELE aka the Protégé Effect Learning Entity is an application to assist in learning by invoking the Protégé Effect.'}
            </Typography>
            
        </Container>

        <Container component="main" sx={{
            justifyContent: 'flex-end',
            marginTop:'auto'
          }} maxWidth="sm">
            <Typography variant="h6">Development team:</Typography>
                <Link href="https://github.com/letriandrew" underline="hover">
                    {'Andrew Le, '}
                </Link>
                <Link href="https://github.com/kikijee" underline="hover">
                    {'Christian Manibusan'}
                </Link>
        </Container>
        
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
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
    </ThemeProvider>
  );
}
