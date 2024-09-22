import { Button } from "@mui/material"
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';



// Used in Record.js
export default function PausePlayButton({handlePause, isRecording, pause}) {
    return (
        <Button
            onClick={handlePause}
            sx={{
                minWidth: '40px',
                opacity: !isRecording ? '0' : '1',
            }}
            disabled={!isRecording}
        >
            {!pause ? <PauseIcon sx={{ fontSize: 40, color: '#878593' }} /> : <PlayArrowIcon sx={{ fontSize: 40, color: '#878593' }} />}
        </Button>
    )
}