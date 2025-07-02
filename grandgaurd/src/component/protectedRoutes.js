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
        // Check for session first
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate('/admin/login');
          return;
        }

        // Now get the user
        const { data: { user } } = await supabase.auth.getUser();
        console.log('ProtectedRoute user:', user);

        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate('/admin/login');
          return;
        }

        // Check if user exists in admin table
        const { data: adminData } = await supabase
          .from('admin')
          .select('*')
          .eq('email', user.email)
          .single();

        console.log('ProtectedRoute adminData:', adminData);

        if (!adminData) {
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate('/admin/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;