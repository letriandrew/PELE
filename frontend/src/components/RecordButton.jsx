import { Button,Typography } from "@mui/material"



// Used in Record.js
export default function RecordButton({handleRecordingToggle, isRecording, pause}) {
    return (
        <Button
            variant="contained"
            onClick={handleRecordingToggle}
            sx={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: isRecording ? 'red' : '#878593',
                opacity: 0.5,
                '&:hover': {
                    backgroundColor: isRecording ? 'darkred' : '#56545e',
                    opacity: 1,
                }
            }}
        >
            <Typography fontWeight={700} letterSpacing={'0.1rem'}>{isRecording ? (pause ? 'resume' : 'pause') : 'Record'}</Typography>
        </Button>
    )
}