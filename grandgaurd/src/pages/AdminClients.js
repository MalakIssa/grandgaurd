import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import './AdminTables.css';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import AdminFooter from '../Footer/AdminFooter';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const { data, error } = await supabase
        .from('clients')
        .select('*');

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch clients data');
      }

      if (!data) {
        throw new Error('No clients data received');
      }

      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading clients...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-table-page">
        <div className="table-header">
          <h1>Client Management</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          {clients.length === 0 ? (
            <div className="no-data-message">No clients found</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.full_name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.gender}</td>
                    <td>{client.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminClients; 