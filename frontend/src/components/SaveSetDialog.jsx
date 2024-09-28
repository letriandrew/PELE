import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    CssBaseline
} from '@mui/material';

export default function SaveSetDialog({ open, handleClose, handleSave }) {
    const [title, setTitle] = useState(''); // State to track the title input

    const handleInputChange = (e) => {
        setTitle(e.target.value); // Update the title state when the user types
    };

    const handleSaveClick = () => {
        if (title !== ""){
            handleSave(title); // Pass the title back to the parent when the save button is clicked
            setTitle('')
            handleClose(); // Close the dialog
        }
    };

    return (
        <>
        <CssBaseline/>
        <Dialog open={open} onClose={handleClose} aria-labelledby="save-set-dialog-title">
            <DialogTitle id="save-set-dialog-title">Save Set</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the title for the set you want to save:
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="set-title"
                    label="Set Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={handleInputChange} // Capture user input
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="dark">
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveClick}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(45deg, #3A394E 30%, #4d4c70 90%)',
                        color: 'white',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #4d4c70 30%, #3A394E 90%)',
                        },
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
