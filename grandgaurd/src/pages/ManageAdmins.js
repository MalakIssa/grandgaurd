import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './ManageAdmins.css';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import AdminFooter from '../Footer/AdminFooter';

const ManageAdmins = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: adminsData, error: adminsError } = await supabase
          .from('admin')
          .select('*')
          .order('name');

        if (adminsError) {
          throw new Error('Failed to fetch administrators list');
        }

        setAdmins(adminsData || []);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('admin')
        .update({
          name: editForm.name,
          phone: editForm.phone,
        })
        .eq('admin_id', selectedAdmin.admin_id);

      if (error) throw error;

      setAdmins(admins.map(admin => 
        admin.admin_id === selectedAdmin.admin_id 
          ? { ...admin, ...editForm }
          : admin
      ));
      setShowEditModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error updating admin:', error);
      setError('Failed to update admin');
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin')
        .delete()
        .eq('admin_id', adminId);

      if (error) throw error;
      
      setAdmins(admins.filter(admin => admin.admin_id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('Failed to delete admin');
    }
  };

  if (loading) {
    return <div className="loading">Loading admins...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="manage-admins-page">
        <div className="manage-admins-header">
          <h1>Manage Administrators</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/admin/add')} className="add-button">
              Add New Admin
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          {admins.length === 0 ? (
            <div className="no-data-message">No administrators found</div>
          ) : (
            <table className="admins-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.admin_id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(admin.admin_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Admin</h2>
                <button 
                  className="close-button"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={editForm.email}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default ManageAdmins; 