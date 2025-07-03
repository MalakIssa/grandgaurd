import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from './supabaseClient';
import './Reports.css';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import AdminFooter from '../Footer/AdminFooter';

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    totalAdmins: 0,
    recentMessages: [],
    recentVolunteers: [],
    volunteersByLocation: {},
    messagesByDate: {}
  });

  const checkAdminAuth = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        throw new Error('Admin not found');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      await supabase.auth.signOut();
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch total counts
      const [usersCount, volunteersCount, adminsCount] = await Promise.all([
        supabase.from('contactUs').select('*', { count: 'exact' }),
        supabase.from('volunteers').select('*', { count: 'exact' }),
        supabase.from('admin').select('*', { count: 'exact' })
      ]);

      // Fetch recent messages
      const { data: recentMessages } = await supabase
        .from('contactUs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent volunteers
      const { data: recentVolunteers } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch volunteer locations
      const { data: volunteerLocations } = await supabase
        .from('volunteers')
        .select('location');

      // Process location data
      const locationCounts = volunteerLocations.reduce((acc, curr) => {
        acc[curr.location] = (acc[curr.location] || 0) + 1;
        return acc;
      }, {});

      // Process message dates
      const { data: messages } = await supabase
        .from('contactUs')
        .select('created_at');

      const messageDateCounts = messages.reduce((acc, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalUsers: usersCount.count || 0,
        totalVolunteers: volunteersCount.count || 0,
        totalAdmins: adminsCount.count || 0,
        recentMessages: recentMessages || [],
        recentVolunteers: recentVolunteers || [],
        volunteersByLocation: locationCounts,
        messagesByDate: messageDateCounts
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAuth();
    fetchReportData();
  }, [checkAdminAuth, fetchReportData]);

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="reports-page">
        <div className="reports-header">
          <h1>System Reports</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="reports-grid">
          {/* Summary Cards */}
          <div className="report-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="report-card">
            <h3>Total Caregivers</h3>
            <p className="stat-number">{stats.totalVolunteers}</p>
          </div>
          <div className="report-card">
            <h3>Total Admins</h3>
            <p className="stat-number">{stats.totalAdmins}</p>
          </div>

          {/* Recent Messages */}
          <div className="report-section wide">
            <h3>Recent Messages</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td>{msg.message.substring(0, 50)}{msg.message.length > 50 ? '...' : ''}</td>
                      <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Volunteers */}
          <div className="report-section wide">
            <h3>Recent Caregivers</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Specialization</th>
                    <th>Date Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVolunteers.map((vol) => (
                    <tr key={vol.volunteer_id}>
                      <td>{vol.full_name}</td>
                      <td>{vol.location}</td>
                      <td>{vol.specialization}</td>
                      <td>{new Date(vol.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Location Distribution */}
          <div className="report-section">
            <h3>Caregivers by Location</h3>
            <div className="stat-list">
              {Object.entries(stats.volunteersByLocation).map(([location, count]) => (
                <div key={location} className="stat-item">
                  <span className="location">{location}</span>
                  <span className="count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Trends */}
          <div className="report-section">
            <h3>Messages by Date</h3>
            <div className="stat-list">
              {Object.entries(stats.messagesByDate).map(([date, count]) => (
                <div key={date} className="stat-item">
                  <span className="date">{date}</span>
                  <span className="count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default Reports; 