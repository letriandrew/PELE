import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Questions from '../components/Questions';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BlinkingCircle from '../components/BlinkingCircle';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [pause, setPause] = useState(false);

  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const microphoneRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRecording && !pause) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording, pause]);

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

      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
      const updateVolume = () => {
        analyzerRef.current.getByteFrequencyData(dataArray);
        const volumeLevel = Math.max(...dataArray);
        setVolume(volumeLevel / 255);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (error) {
      console.error('Error capturing audio:', error);
    }
  };

  const stopAudioCapture = async () => {
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
    setVolume(0);

    if (mediaRecorderRef.current) {
      await mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        recordedChunksRef.current = [];
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const newAudioUrl = URL.createObjectURL(blob);
        setAudioUrl(newAudioUrl);
        mediaRecorderRef.current = null;
      };
    }
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
    setAudioUrl(null);
    setPause(false);
    recordedChunksRef.current = [];
  };

  const handlePause = () => {
    if (mediaRecorderRef.current) {
      if (pause) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setPause(!pause);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
            position: 'relative',
          }}
        >
          <CssBaseline />

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
                  opacity: 1,
                },
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {isRecording ? (
                <Typography fontWeight={700} letterSpacing={'0.1rem'}>END</Typography>
              ) : (
                <Typography fontWeight={700} letterSpacing={'0.1rem'}>Record</Typography>
              )}
            </Button>

            {!pause ? (
              <Button
                onClick={handlePause}
                sx={{
                  position: 'absolute',
                  right: 'calc(50% + 90px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  minWidth: '40px',
                  opacity: !isRecording ? '0' : '1',
                }}
                disabled={!isRecording}
              >
                <PauseIcon sx={{ fontSize: 40, color: '#878593' }} />
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                sx={{
                  position: 'absolute',
                  right: 'calc(50% + 90px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  minWidth: '40px',
                  opacity: !isRecording ? '0' : '1',
                }}
                disabled={!isRecording}
              >
                <PlayArrowIcon sx={{ fontSize: 40, color: '#878593' }} />
              </Button>
            )}

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              position: 'absolute',
              left: 'calc(50% + 90px)',
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: '40px',
              opacity: !isRecording ? '0' : '1',
            }}>
              
              <Typography color="textPrimary" sx = {{letterSpacing : '0.1rem', fontWeight: 700}}>
                { !pause ?
                'RECORDING'
                :
                'PAUSED'
                }
              </Typography>
              { !pause &&
              <BlinkingCircle/>
              }
            </Box>

          </Box>

          <Typography variant="h5" sx={{ marginTop: 25, position: 'absolute' }}>
            {`${formatTime(seconds)}`}
          </Typography>

          <Box
            sx={{
              marginTop: 40,
              width: '200px',
              height: '30px',
              backgroundColor: '#2d2d2d',
              position: 'absolute',
              opacity: isRecording && !pause ? 1 : 0,
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${volume * 100}%`,
                backgroundColor: '#9D4747',
                transition: 'width 0.1s',
              }}
            />
          </Box>

          <Box sx={{ position: 'absolute', bottom: 40 }}>
            <Button
              variant="contained"
              disabled={audioUrl === null}
              onClick={handleGenerate}
              sx={{
                opacity: 0.5,
                backgroundColor: '#44a5ff',
                disabled: audioUrl === null,
                '&:hover': {
                  backgroundColor: '#1976d2',
                  opacity: 1,
                },
              }}
            >
              <Typography fontWeight={550} letterSpacing={'.1rem'}>Generate</Typography>
            </Button>
          </Box>

          {audioUrl && (
            <Box sx={{ position: 'absolute', bottom: 100 }}>
              <Box
                sx={{
                  backgroundColor: '#191919', // Change the color as needed
                  padding: '10px', // Adjust padding to create spacing around the audio element
                  paddingTop: '15px',
                  borderRadius: '35px', // Optional: to round the corners
                }}
              >
                <audio controls src={audioUrl} type="audio/webm"></audio>
              </Box>
              <Button
                onClick={handleDelete}
                sx={{
                  position: 'absolute',
                  left: 'calc(60% + 155px)',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  minWidth: '40px',
                  opacity: audioUrl === null ? '0' : '1',
                }}
                disabled={audioUrl === null}
              >
                <DeleteIcon sx={{ fontSize: 40, color: '#878593' }} />
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Questions back={handleGenerate} />
      )}
    </>
  );
};

export default Record;
