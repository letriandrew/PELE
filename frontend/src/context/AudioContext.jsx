import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [processedAudioResponse, setProcessedAudioResponse] = useState(null);

  return (
    <AudioContext.Provider value={{ processedAudioResponse, setProcessedAudioResponse }}>
      {children}
    </AudioContext.Provider>
  );
};
