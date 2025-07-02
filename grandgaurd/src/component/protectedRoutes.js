import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../pages/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/admin/login');
          return;
        }

        // Check if user exists in admin table
        const { data: adminData } = await supabase
          .from('admin')
          .select('*')
          .eq('email', user.email)
          .single();

        if (!adminData) {
          navigate('/admin/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;