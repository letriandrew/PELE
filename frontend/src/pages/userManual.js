import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const UserManual = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate image load event
    const timer = setTimeout(() => {
      setLoaded(true); // Change state to make the image visible
    }, 4000); // Simulating slight delay before showing the image
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CssBaseline />
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center horizontally and vertically
        opacity: loaded ? 0 : 1, // Control visibility with opacity
          transition: 'opacity 8s ease-in-out', // Smooth transition for fade-in
        }}>
      <CircularProgress />
        </Box>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(https://i.ytimg.com/vi/678cV9ldaMg/maxresdefault.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: loaded ? 1 : 0, // Control visibility with opacity
          transition: 'opacity 15s ease-in-out', // Smooth transition for fade-in
        }}
      />
    </>
  );
};

export default UserManual;
