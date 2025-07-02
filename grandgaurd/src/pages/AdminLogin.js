import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient'; // Import supabase directly
import './AdminLogin.css';
import Navbar from '../components/Navbar/Navbar'; // User Navbar
import Footer from '../Footer/Footer'; // User Footer

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const signOutIfLoggedIn = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.signOut();
        // Optionally, reload to clear all state
        window.location.reload(); 
      }
    };
    signOutIfLoggedIn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Authentication failed');

      // 2. Verify admin status in database
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', data.user.email)
        .single();

          console.log('Admin verification result:', { adminData, adminError }); // Debug log

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('Admin privileges not found. Please contact system administrator.');
      }

      // 3. Store authentication state
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard', { replace: true });
      
    } catch (err) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="content-container">
        <div className="admin-login-box">
          <h1>Admin Portal</h1>
          <p className="admin-login-subtitle">Please sign in to continue</p>
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="admin-login-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;