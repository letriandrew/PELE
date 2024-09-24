import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { CssBaseline } from '@mui/material';

export default function LoadingScreen() {
  return (
    <>
    <CssBaseline/>
    <Box
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight: '90vh',display: 'flex' }}>
      <CircularProgress />
    </Box>
    </>
  );
}