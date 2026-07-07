import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect( () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.get(`${apiUrl}/verify-session`).then((response) =>{
        setIsAuthenticated(true);
      }).catch(() => {
        setIsAuthenticated(false);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Session...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
