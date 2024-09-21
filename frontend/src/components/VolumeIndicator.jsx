import { Box } from "@mui/material"


export default function VolumeIndicator({isRecording, pause, volume}) {
    return (
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
    )
}