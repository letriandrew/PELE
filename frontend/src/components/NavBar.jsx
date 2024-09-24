import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { AuthDispatchContext , AuthContext} from '../context/AuthContext';

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [pages,setPages] = React.useState([['Sign Up', '/signUp'],['Sign In','/signIn'],['About Us', '/aboutUs']])
  const [user, setUser] = React.useState(true)   // will change later to accomidate auth context provider

  const authDispatch = React.useContext(AuthDispatchContext)
  const auth = React.useContext(AuthContext)

  const navigate = useNavigate();

  const settings = [['Logout',()=>{
    sessionStorage.removeItem('user');
    authDispatch({type:'reset'})
    navigate('/')
  }]];

  React.useEffect(() =>{
    if(JSON.parse(sessionStorage.getItem('user'))){
      setPages([['Record!', '/record'], ['User Manual', '/userManual'], ['About Us', '/aboutUs']])
    }
    else{
      setPages([['Sign Up', '/signUp'],['Sign In','/signIn'],['About Us', '/aboutUs']])
    }
  },[auth])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{
      background: "linear-gradient(90deg, #7f99ff 0%, #d63b3b 100%)", // Linear gradient, 
      marginTop: 4,
      mx: 2, // Adds margin to the left and right
      borderRadius: 10, // Adjusts the roundness of the corners
      width: `calc(100% - 32px)`, // Ensures it fits the container minus the horizontal margins
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AutoStoriesIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'sans-serif',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              paddingRight: '50px'
            }}
          >
            PELE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >

              {
                  pages.map((page) => (
                    <MenuItem key={page[0]} onClick={handleCloseNavMenu} to={page[1]}>
                      <Typography sx={{ textAlign: 'center' }}>{page[0]}</Typography>
                    </MenuItem>
                  ))
              }
            </Menu>
          </Box>
          <AutoStoriesIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PELE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                href={page[1]}
                key={page[0]}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', paddingLeft: '25px', paddingRight: '25px' }}
              >
                <Typography fontWeight={700} sx={{ letterSpacing: '0.1rem' }}>{page[0]}</Typography>
              </Button>
            ))}
          </Box>
          <>
          { JSON.parse(sessionStorage.getItem('user')) &&
          <Typography marginRight={2} fontSize={20}>{JSON.parse(sessionStorage.getItem('user')).name.substring(0,JSON.parse(sessionStorage.getItem('user')).name.indexOf(" "))}</Typography>
          }

          { JSON.parse(sessionStorage.getItem('user')) &&
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting[0]} 
                  onClick={()=>{
                    handleCloseUserMenu()
                    setting[1]()
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{setting[0]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          }
          </>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
