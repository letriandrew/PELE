import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({message, status, close}) {

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
        {status === true &&
            <Snackbar open={true} autoHideDuration={6000} onClose={close}>
                <Alert onClose={close} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        }
        {status === false &&
            <Snackbar open={true} autoHideDuration={6000} onClose={close}>
                <Alert onClose={close} severity="error" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        }
    </Stack>
  );
}