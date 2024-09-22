import { Button, Typography } from "@mui/material"


// Used in Record.js
export default function ({handleGenerate,audioUrl}) {
    return (
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
    )
}