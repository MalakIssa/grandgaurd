import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from './supabaseClient';
import './AdminDashboard.css';
import clientsIcon from '../images/people.png';
import caregiversIcon from '../images/handshake.png';
import reportIcon from '../images/report.png';
import managerIcon from '../images/manager.png';
import oldWomanIcon from '../images/old-woman.png';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import AdminFooter from '../Footer/AdminFooter';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    totalClients: 0,
    totalVolunteers: 0,
    totalElderly: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminAuth();
    fetchDashboardData();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Auth error:', userError);
        throw new Error('Not authenticated');
      }

      // Fetch admin details
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('name')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        console.error('Error fetching admin:', adminError);
        throw new Error('Admin not found');
      }

      setAdminName(adminData.name);
    } catch (error) {
      console.error('Authentication check failed:', error);
      await supabase.auth.signOut();
      navigate('/admin/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch total clients count
      const { count: clientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('*', { count: 'exact' });

      if (clientsError) throw clientsError;

      // Fetch total volunteers count
      const { count: volunteersCount, error: volunteersError } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact' });

      if (volunteersError) throw volunteersError;

      // Fetch total elderly count
      const { count: elderlyCount, error: elderlyError } = await supabase
        .from('elderly')
        .select('*', { count: 'exact' });

      if (elderlyError) throw elderlyError;

      setStats({
        totalClients: clientsCount || 0,
        totalVolunteers: volunteersCount || 0,
        totalElderly: elderlyCount || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-dashboard">
        <header className="dashboard-welcome-header blue-header">
          <h1 className="dashboard-welcome-title">Welcome, {adminName || 'Admin'}</h1>
          <p className="dashboard-welcome-subtitle">This is your main dashboard overview.</p>
        </header>
        <main className="dashboard-content">
          {error && <div className="error-message">{error}</div>}

          {/* Stats Cards */}
          <div className="stats-grid">
            <Link to="/admin/clients" className="stat-card">
              <div className="stat-icon clients-icon">
                <img src={clientsIcon} alt="Clients" />
              </div>
              <div className="stat-details">
                <h3>Total Clients</h3>
                <p className="stat-number">{stats.totalClients}</p>
                <span className="view-more">View Details →</span>
              </div>
            </Link>

            <div className="stat-card">
              <div className="stat-icon admins-icon">
                <img src={oldWomanIcon} alt="Elderly" />
              </div>
              <div className="stat-details">
                <h3>Total Elderly</h3>
                <p className="stat-number">{stats.totalElderly}</p>
              </div>
            </div>

            <Link to="/admin/volunteers" className="stat-card">
              <div className="stat-icon caregivers-icon">
                <img src={caregiversIcon} alt="Caregivers" />
              </div>
              <div className="stat-details">
                <h3>Total Caregivers</h3>
                <p className="stat-number">{stats.totalVolunteers}</p>
                <span className="view-more">View Details →</span>
              </div>
            </Link>

            <Link to="/admin/manage" className="stat-card">
              <div className="stat-icon admins-icon">
                <img src={managerIcon} alt="Admins" />
              </div>
              <div className="stat-details">
                <h3>Manage Admins</h3>
                <span className="view-more">View Details →</span>
              </div>
            </Link>

            <Link to="/admin/reports" className="stat-card">
              <div className="stat-icon reports-icon">
                <img src={reportIcon} alt="Reports" />
              </div>
              <div className="stat-details">
                <h3>View Reports</h3>
                <span className="view-more">View Details →</span>
              </div>
            </Link>
          </div>
        </main>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminDashboard;