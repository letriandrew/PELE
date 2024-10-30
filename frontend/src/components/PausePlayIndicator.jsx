import { Box, Typography } from "@mui/material"
import BlinkingCircle from "./BlinkingCircle"

export default function PausePlayIndicator({isRecording, pause}) {
    return (
        <>
            <Typography color="textPrimary" sx={{
                letterSpacing: '0.1rem',
                fontWeight: 700,
                minWidth: '40px',
                opacity: !isRecording ? '0' : '1'
            }}
            >
                {!pause ?
                    'RECORDING'
                    :
                    'PAUSED'
                }
            </Typography>
            {
                (!pause && isRecording) &&
                <BlinkingCircle />
            }
        </>
    )
}