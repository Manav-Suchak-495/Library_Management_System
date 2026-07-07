import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#27CF54',
        light: '#36DF54',
        dark: '#18BF27',
      },
      secondary: {
        main: '#F5F5F5',
        light: '#F5F5F5',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
