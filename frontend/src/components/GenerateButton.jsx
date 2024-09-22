import { Button, Typography } from "@mui/material"


// Used in Record.js
export default function ({handleGenerate,audioUrl}) {
    return (
        <Button
            variant="contained"
            disabled={audioUrl === null}
            onClick={handleGenerate}
            sx={{
                opacity: audioUrl === null ? 0.5 : 1,
                disabled: audioUrl === null,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                    },
            }}
        >
            <Typography fontWeight={550} letterSpacing={'.1rem'}>Generate</Typography>
        </Button>
    )
}