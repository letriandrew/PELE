import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Paper } from '@mui/material';
import NavBar from './components/NavBar'
import Home from './pages/Home';

function App() {
  const theme = createTheme({
    palette:{
      mode:"dark"
    }
  })

  return (
    <Router>
      <ThemeProvider theme={theme}>
      <Paper sx={{height: "100vh"}}>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
        </Paper>
      </ThemeProvider>
    </Router>
  );
}

export default App;
