import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Questions from '../components/Questions';
import GenerateButton from '../components/GenerateButton';
import DeleteButton from '../components/DeleteButton';
import VolumeIndicator from '../components/VolumeIndicator';
import RecordButton from '../components/RecordButton';
import PausePlayIndicator from '../components/PausePlayIndicator';
import { useAudioContext } from '../context/AudioContext';
import { sendAudio } from '../apiService';

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);  // for initial recording button press
  const [generate, setGenerate] = useState(false);  
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [pause, setPause] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [page, setPage] = useState(0);  // 0 is the recording page, 1 is the question generate page  
  const { setProcessedAudioResponse } = useAudioContext();


  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const microphoneRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const animationFrameRef = useRef(null);

  //const { setProcessedAudioList } = useAudio();

  // functionality for recorder timer
  useEffect(() => {
    let timer;
    if (isRecording && !pause) {
      //audioUrl && setSeconds(0);
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording, pause]);

  // functionality for starting/stopping audio capture
  useEffect(() => {
    if (isRecording) {
      setProcessedAudioResponse(null)
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

      mediaRecorderRef.current.start(1000);
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
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/mp3' });
        recordedChunksRef.current = [];
        setAudioBlob(blob); //store the blob and ensure it doesnt get lost for backend transfer
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
    // initial recording button press
    if (!isRecording) {
      setSeconds(0);
      setAudioUrl(null);
      setPause(false)
      setIsRecording(!isRecording);
    }
    // everything else
    else{
      handlePause()
    }
  };

  const handlePage = (num) => {
    setPage(num)
  }

  // axios call here to server
  const handleGenerate = async () => {
    setIsRecording(false);
    setGenerate(!generate);

    if (audioBlob) { //checking if stored blob exists

      // Prepare form data
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.mp3'); // 'audio' is the field name, 'recording.webm' is the file name

      const response = await sendAudio(formData)
      if (response.status === 200) {
        setProcessedAudioResponse(response.data); // Save the backend response
      }
      else{
        setProcessedAudioResponse({});  // empty dictionary
        // handle front end notification error here
      }


    }
    else {
      console.error("No audio blob available.");
    }

    handleDelete()

  };

  const handleDelete = async() => {
    setIsRecording(false);
    setSeconds(0);
    setAudioBlob(null)
    setPause(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    //setProcessedAudioResponse(null)

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
    setVolume(0);

    if (mediaRecorderRef.current) {
      await mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        recordedChunksRef.current = [];
        mediaRecorderRef.current = null;
      };
    }
  };

  const handlePause = async() => {
    if (mediaRecorderRef.current) {
      if (pause) {
        mediaRecorderRef.current.resume();

        mediaRecorderRef.current.onresume =()=>{
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }
          setAudioUrl(null);
        }
      } 
      else {
        await mediaRecorderRef.current.pause();

        mediaRecorderRef.current.onpause =()=>{
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/mp3' });
          setAudioBlob(blob); //store the blob and ensure it doesnt get lost for backend transfer
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }
          const newAudioUrl = URL.createObjectURL(blob);
          setAudioUrl(newAudioUrl);
        }
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
      {page === 0 ? (
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

          <Box sx={{
            position: 'relative',
            marginTop: '-80px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          >
            <RecordButton handleRecordingToggle={handleRecordingToggle} isRecording={isRecording} pause={pause}/>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              left: 'calc(50% + 90px)',
              top: '50%',
              transform: 'translateY(-50%)',
            }}>

              <PausePlayIndicator isRecording={isRecording} pause={pause} />

            </Box>

          </Box>

          {/* Time */}
          <Typography variant="h5" sx={{ marginTop: 25, position: 'absolute' }}>
            {`${formatTime(seconds)}`}
          </Typography>

          {/* Volume indicator */}
          <VolumeIndicator isRecording={isRecording} pause={pause} volume={volume} />

          {/* Generate Button */}
          <Box sx={{ position: 'absolute', bottom: 40 }}>
            <GenerateButton handlePage={handlePage} handleGenerate={handleGenerate} audioUrl={audioUrl} />
          </Box>

          {/* Box for playback and delete button */}
          {audioUrl && (
            <Box sx={{ position: 'absolute', bottom: 100 }}>
              <Box
                sx={{
                  backgroundColor: '#191919',
                  padding: '10px',
                  paddingTop: '15px',
                  borderRadius: '35px',
                }}
              >
                <audio controls src={audioUrl} type="audio/mp3"></audio>
              </Box>
              <Box sx={{
                position: 'absolute',
                left: 'calc(60% + 155px)',
                top: '45%',
                transform: 'translateY(-50%)',
              }}>
                <DeleteButton handleDelete={handleDelete} audioUrl={audioUrl} />
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Questions handleDelete = {handleDelete} handlePage={handlePage} />
      )}
    </>
  );
};

export default Record;
