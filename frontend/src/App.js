import './App.css';

import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar'
import Home from './pages/Home';
import Record from './pages/Record';
import AboutUs from './pages/AboutUs';
import UserManual from './pages/UserManual';

function App() {
  const theme = createTheme({
    palette:{
      mode:"dark"
    }
  })

  return (
    <Router>
      <CssBaseline/>
      <ThemeProvider theme={theme}>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/record" element={<Record/>}/>
            <Route path="/aboutUs" element={<AboutUs/>}/>
            <Route path="/userManual" element={<UserManual/>}/>
          </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
