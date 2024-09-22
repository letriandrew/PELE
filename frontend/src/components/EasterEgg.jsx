import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


export default function EasterEgg() {

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaded(true); 
        }, 4000); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)', 
                opacity: loaded ? 0 : 1,
                transition: 'opacity 8s ease-in-out', 
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
                    opacity: loaded ? 1 : 0, 
                    transition: 'opacity 15s ease-in-out', 
                }}
            />
        </>
    )
}