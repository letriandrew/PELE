import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Questions from '../components/Questions';
import DeleteIcon from '@mui/icons-material/Delete';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0); // To track the volume level
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
  }, [isRecording]);

  const startAudioCapture = async () => {
    if (!navigator.mediaDevices.getUserMedia) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;

      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyzerRef.current);

      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

      const updateVolume = () => {
        analyzerRef.current.getByteFrequencyData(dataArray);
        const volumeLevel = Math.max(...dataArray); // Get max volume
        setVolume(volumeLevel / 255); // Normalize volume to a value between 0 and 1
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error('Error capturing audio:', error);
    }
  };

  const stopAudioCapture = () => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setVolume(0); // Reset volume when stopped
  };

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleGenerate = () => {
    setIsRecording(false);
    setGenerate(!generate);
    console.log(generate);
  };

  const handleDelete = () => {
    setIsRecording(false);
    setSeconds(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      {!generate ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '100px',
            paddingBottom: '100px',
            minHeight: '100vh',
            position: 'relative', // Added to position child elements absolutely
          }}
        >
          <CssBaseline />

          {/* Button Container for Record and Trash Icon */}
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="contained"
              onClick={handleRecordingToggle}
              sx={{
                marginTop: '-80px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: isRecording ? 'red' : '#878593',
                opacity: 0.5,
                '&:hover': {
                  backgroundColor: isRecording ? 'darkred' : '#56545e',
                  opacity: 1
                },
                position: 'absolute', // Keep it centered
                left: '50%',
                transform: 'translateX(-50%)', // Center it horizontally
              }}
            >
              {isRecording ? (
                <Typography fontWeight={700} letterSpacing={'0.1rem'}>Stop</Typography>
              ) : (
                <Typography fontWeight={700} letterSpacing={'0.1rem'}>Record</Typography>
              )}
            </Button>

            {/* Trash Button Icon */}
            <Button
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                left: 'calc(50% + 90px)', // Adjust distance to the right of the record button
                top: '50%', // Center vertically
                transform: 'translateY(-50%)',
                minWidth: '40px',
                opacity: seconds === 0 && !isRecording ? '0' : '1',
              }}
              disabled={seconds === 0}
            >
              <DeleteIcon sx={{ fontSize: 40, color: '#878593' }} />
            </Button>
          </Box>

          {/* Timer Display */}
          <Typography variant="h5" sx={{ marginTop: 25, position: 'absolute' }}>
            {`${formatTime(seconds)}`}
          </Typography>

          {/* Volume Indicator */}
          <Box
            sx={{
              marginTop: 40,
              width: '200px',
              height: '30px',
              backgroundColor: '#2d2d2d',
              position: 'absolute',
              opacity: isRecording? 1 : 0
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${volume * 100}%`, // Adjust width based on volume
                backgroundColor: '#9D4747',
                transition: 'width 0.1s',
              }}
            />
          </Box>

          {/* Generate Button */}
          <Box sx={{ position: 'absolute', bottom: 40 }}>
            <Button
              variant="contained"
              disabled={seconds === 0}
              onClick={handleGenerate}
              sx={{
                opacity: 0.5,
                backgroundColor: '#44a5ff',
                disabled: seconds === 0,
                '&:hover': {
                  backgroundColor: '#1976d2',
                  opacity: 1
                },
              }}
            >
              <Typography fontWeight={550} letterSpacing={'.1rem'}>Generate</Typography>
            </Button>
          </Box>
        </Box>
      ) : (
        <Questions back={handleGenerate} />
      )}
    </>
  );
};

export default Record;
