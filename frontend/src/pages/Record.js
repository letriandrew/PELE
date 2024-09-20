import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Questions from '../components/Questions';
import DeleteIcon from '@mui/icons-material/Delete';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);  // state for the record button
  const [generate, setGenerate] = useState(false); // state for the generate button
  const [seconds, setSeconds] = useState(0);  // to track seconds of recording time
  const [volume, setVolume] = useState(0); // To track the volume level
  const [audioUrl, setAudioUrl] = useState(null); // Store the recorded audio

  // use ref used here to keep different api usages stable and consistant across rerenders
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const microphoneRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Ref to store media recorder
  const recordedChunksRef = useRef([]); // Ref to store audio chunks
  const overallRecordedChunksRef = useRef([]);
  const animationFrameRef = useRef(null);

  // use effect for seconds incrementation when recording
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      console.log(audioUrl)
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // use effect to call start/stop audio capture functionality
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
      analyzerRef.current = await audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;

      microphoneRef.current = await audioContextRef.current.createMediaStreamSource(stream);
      await microphoneRef.current.connect(analyzerRef.current);

      // Initialize MediaRecorder to capture audio data
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = []; // Reset chunks on new recording

      // Capture audio chunks and store them
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      // Start recording
      await mediaRecorderRef.current.start();

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

  const stopAudioCapture = async () => {
    if (microphoneRef.current) {
      await microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setVolume(0); // Reset volume when stopped

    // Stop media recorder and create an audio URL from recorded chunks
    if (mediaRecorderRef.current) {
      await mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        // Combine the existing recorded chunks with the new ones
        await overallRecordedChunksRef.current.push.apply(overallRecordedChunksRef.current, recordedChunksRef.current)
        const blob = new Blob(overallRecordedChunksRef.current, { type: 'audio/webm' });

        console.log('Blob size:', blob.size);

        // Revoke the old audio URL to release memory
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        const newAudioUrl = URL.createObjectURL(blob);
        setAudioUrl(newAudioUrl); // Store the new combined audio URL for playback

        const audioElement = document.querySelector('audio');
        if (audioElement) {
          audioElement.src = newAudioUrl; // Set new source
          audioElement.currentTime = 0;   // Reset playback position
          audioElement.load();            // Reload the new audio file
        }

        
      };
    }
  };



  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
  };

  // Generate functionality
  // TO DO: send over audio serverside here
  const handleGenerate = () => {
    setIsRecording(false);
    setGenerate(!generate);
    console.log(generate);
  };

  const handleDelete = () => {
    setIsRecording(false);
    setSeconds(0);
    setAudioUrl(null); // Clear the recorded audio
    recordedChunksRef.current = []; // Clear the recorded chunks
    overallRecordedChunksRef.current = []
  };

  // helper to make seconds into 00:00 format
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
                <Typography fontWeight={700} letterSpacing={'0.1rem'} >Stop</Typography>
              ) : (
                <Typography fontWeight={700} letterSpacing={'0.1rem'} >Record</Typography>
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
              opacity: isRecording ? 1 : 0
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

          {/* Playback Button */}
          {audioUrl && (
            <Box sx={{ position: 'absolute', bottom: 100 }}>
              <audio
                controls
                src={audioUrl}
                type="audio/webm"
                onPlay={() => {
                  console.log("Current src of the audio tag:", audioUrl);
                }}
              ></audio>
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
