import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import LoadingOverlay from './LoadingOverlay';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect( () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.post(`${apiUrl}/verify-session`,{"Token": sessionStorage.getItem("Token")}).then((response) =>{
        setIsAuthenticated(true);
      }).catch((error) => {
        console.error("Session verification failed backend-side:", error.response?.data);
          setIsAuthenticated(false);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100dvh' }}>
        <LoadingOverlay open={true} />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
