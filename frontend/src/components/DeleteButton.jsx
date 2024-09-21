import { Button } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';



// Used in Record.jsx
export default function DeleteButton({handleDelete, audioUrl}) {
    return (
        <Button
            onClick={handleDelete}
            sx={{
                minWidth: '40px',
                opacity: audioUrl === null ? '0' : '1',
            }}
            disabled={audioUrl === null}
        >
            <DeleteIcon sx={{ fontSize: 40, color: '#878593' }} />
        </Button>
    )
}