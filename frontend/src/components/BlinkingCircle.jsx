import { Box } from "@mui/material";


// Used in PausePlayIndicator
export default function BlinkingCircle () {
    return (
    <Box
      sx={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'red',
        marginLeft: '8px',
        animation: 'blink 1s infinite',
        '@keyframes blink': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    />
  );}