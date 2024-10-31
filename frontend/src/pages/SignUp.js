import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { GoogleIcon } from '../components/CustomIcons';
import { signUpUser, signInUser } from '../apiService';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { AuthDispatchContext } from '../context/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const [notificationStatus, setNotificationStatus] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState("");
  const authDispatch = React.useContext(AuthDispatchContext)
  const navigate = useNavigate();

  const [signUpDisabled, setSignUpDisabled] = React.useState(true);


  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const response = await signUpUser({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    });
    if (response.status === 200){
      console.log("account creation success!",response.data)
      form.reset();
      // setNotificationStatus(true)
      // setNotification(true)
      // setNotificationMessage("Account successfully created")
      // navigate('/signIn')

      const res = await signInUser({
        email: data.get('email'),
        password: data.get('password'),
      });
      
      if (res.status === 200){
        console.log("sign in success!",res.data)
        sessionStorage.setItem('user',JSON.stringify(res.data))  // save basic user data in session storage for easy access
        authDispatch({type:'change',payload:res.data})           // setting context provider use state
        navigate('/')
      }
      else{
        console.error("error during sign in",res)
      }


    }
    else{
      console.error("error in account creation",response.response)
      setNotificationStatus(false)
      setNotification(true)
      setNotificationMessage(response.response.data.detail)
    }
  };

  const handleCloseNotification =()=>{
    setNotification(false)
  }

  return (
    <>
        <CssBaseline />
          <Stack
            sx={{
              justifyContent: 'center',
              height: signUpDisabled ? '88dvh': '100dvh',
              p: 2,
              pt: 7,
              mt: {
                xl:4,
                lg:10,
                md:10,
                sm:10,
                xs:10
              }
            }}
          >
            <Card variant="outlined">
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                Sign up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <FormControl>
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <TextField
                    disabled = {signUpDisabled}
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    placeholder="Jon Snow"
                    error={nameError}
                    helperText={nameErrorMessage}
                    color={nameError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    disabled = {signUpDisabled}
                    required
                    fullWidth
                    id="email"
                    placeholder="your@email.com"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    error={emailError}
                    helperText={emailErrorMessage}
                    color={passwordError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    disabled = {signUpDisabled}
                    required
                    fullWidth
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    variant="outlined"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    color={passwordError ? 'error' : 'primary'}
                  />
                </FormControl>
                {/* <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive updates via email."
                /> */}
                <Button
                  disabled = {signUpDisabled}
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={validateInputs}
                  sx={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                    },
                    mt:2
                  }}
                >
                  Sign up
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                  Already have an account?{' '}
                  <span>
                    <Link
                      href="/signIn"
                      variant="body2"
                      sx={{ alignSelf: 'center' }}
                    >
                      Sign in
                    </Link>
                  </span>
                </Typography>
              </Box>
              {/* <Divider>
                <Typography sx={{ color: 'text.secondary' }}>or</Typography>
              </Divider>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  onClick={() => alert('Sign up with Google')}
                  startIcon={<GoogleIcon />}
                  sx={{
                    borderColor: '#FE6B8B', // Change this to your preferred outline color
                    color: 'white',       // Optional: Match text color with the outline color
                    '&:hover': {
                      borderColor: '#FE6B8B',  // Change this for the hover state
                    },
                  }}
                >
                  Sign up with Google
                </Button>
              </Box> */}
            </Card>
            

            { notification &&
            <Notification message = {notificationMessage} status = {notificationStatus} close = {handleCloseNotification}/>
            }
          </Stack>
          {signUpDisabled && (
          <Box
            sx={{
              backgroundColor: '#ffeb3b',
              color: '#000',
              padding: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            Hello! Our web application is currently under going testing by a select
            number of users. Signing up is temporarily disabled. If you would like
            to become a tester, please contact one of our team members in the about
            us page. Hope to see you soon!
            <br />
            <strong>- PELE team</strong>
          </Box>
        )}
        </>
  );
}
