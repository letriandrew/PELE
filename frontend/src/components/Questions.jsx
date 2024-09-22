import { Button, Typography, Box, Card, CardContent} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';


// Used in Record.js
export default function Questions ({back}) {
    return(
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '100px',
            paddingBottom: '100px',
            minHeight: '100vh'
        }}>
            <CssBaseline/>

            <Grid container spacing={2} sx={{ marginTop: 5, width: '80%'}}>
                {[...Array(10)].map((_, index) => (
                <Grid 
                    key={index}
                    size = {{
                        xs: 12, md: 2.4
                    }}
                >
                    <Card>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Question {index+1}
                        </Typography>
                        <Typography variant="body2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                            nisi ut aliquip ex ea commodo consequat. 
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                ))}
            </Grid>

            <Box sx={{ padding: '50px'}}>
                <Button
                variant="contained"
                sx={{
                    backgroundColor: '#44a5ff',
                    '&:hover': {
                    backgroundColor: '#1976d2'
                    }
                }}
                onClick={back}
                >
                <Typography fontWeight={550}>Back To Recording</Typography>
                </Button>
            </Box>
        </Box>
    );
}