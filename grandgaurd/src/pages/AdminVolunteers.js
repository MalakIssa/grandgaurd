import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './AdminTables.css';
import { AuthService } from './volunteerAuthService';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import AdminFooter from '../Footer/AdminFooter';

const formatLocation = (location) => {
  if (!location) return '';
  // Remove plus codes if present, and trim whitespace
  let parts = location.split(',').map(s => s.trim());
  // If the first part is a plus code (e.g., 68F4+54), keep it, otherwise skip
  if (/^[A-Z0-9+]{4,}/.test(parts[0])) {
    return parts.slice(0, 3).join(', ');
  }
  return parts.slice(0, 2).join(', ');
};

const AdminVolunteers = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interviewModal, setInterviewModal] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);

  const handleApproveReject = async (volunteerId, currentStatus, volunteerEmail) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'approve' : 'reject';

    if (!window.confirm(`Are you sure you want to ${action} this caregiver?`)) {
      return;
    }

    try {
      // Call a service function to update the status and send email
      const { success, error: serviceError } = await AuthService.updateVolunteerApprovalStatus(
        volunteerId,
        newStatus,
        volunteerEmail,
        action // Pass action for email content
      );

      if (!success) throw new Error(serviceError || `Failed to ${action} caregiver.`);

      // Optimistically update UI
      setVolunteers(prevVolunteers =>
        prevVolunteers.map(v =>
          v.volunteer_id === volunteerId ? { ...v, is_approved: newStatus } : v
        )
      );
      alert(`Caregiver ${action}d successfully and email sent!`);
    } catch (error) {
      console.error(`Error ${action}ing caregiver:`, error);
      setError(`Failed to ${action} caregiver: ${error.message}`);
    }
  };

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      setError('Failed to load caregivers');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdminAuth = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Auth error:', userError);
        throw new Error('Not authenticated');
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        console.error('Error fetching admin:', adminError);
        throw new Error('Admin not found');
      }
      setAdminId(adminData.admin_id);
    } catch (error) {
      console.error('Authentication check failed:', error);
      await supabase.auth.signOut();
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    checkAdminAuth();
    fetchVolunteers();
  }, [checkAdminAuth, fetchVolunteers]);

  const handleDelete = async (volunteerId) => {
    if (!window.confirm('Are you sure you want to delete this caregiver?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('volunteer_id', volunteerId);

      if (error) throw error;
      
      setVolunteers(volunteers.filter(v => v.volunteer_id !== volunteerId));
    } catch (error) {
      console.error('Error deleting caregiver:', error);
      setError('Failed to delete caregiver');
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour] = timeStr.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12; // The hour '0' should be '12'
    return `${h}${ampm}`;
  };

  const formatAvailability = (availability) => {
    if (!availability || !Array.isArray(availability) || availability.length === 0) return 'Not specified';
    
    return availability.map(slot => {
      const startTime = formatTime(slot.start_time);
      const endTime = formatTime(slot.end_time);
      return `${slot.day_of_week} (${slot.shift_type}, ${startTime}-${endTime}): $${slot.wage}`;
    }).join('; ');
  };

  const handleScheduleInterview = async () => {
    setInterviewLoading(true);
    try {
      // Format date and time for Zoom API without UTC conversion
      const start_time = `${interviewDate}T${interviewTime}:00`;

      console.log('adminId being sent:', adminId);
      const response = await fetch('http://localhost:5000/api/schedule-zoom-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Caregiver Interview',
          start_time,
          duration: 30,
          email: interviewModal.volunteer.email,
          volunteer_id: interviewModal.volunteer.volunteer_id,
          admin_id: adminId
        })
      });
      alert('Interview scheduled and email sent!');
      setInterviewModal(null);
      setInterviewDate('');
      setInterviewTime('');
      fetchVolunteers();
    } catch (err) {
      alert('Failed to schedule interview: ' + err.message);
    }
    setInterviewLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading caregivers...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-table-page">
        <div className="table-header">
          <h1>Caregiver Management</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.volunteer_id}>
                  <td>{volunteer.full_name}</td>
                  <td>{volunteer.email}</td>
                  <td>{volunteer.phone}</td>
                  <td>{formatLocation(volunteer.location)}</td>
                  <td>{volunteer.specialization || 'N/A'}</td>
                  <td>
                    {volunteer.status === 'pending' && 'Pending'}
                    {volunteer.status === 'interviewing' && 'Interviewing'}
                    {volunteer.status === 'accepted' && 'Accepted'}
                    {volunteer.status === 'rejected' && 'Rejected'}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="view-button"
                      onClick={() => {
                        setSelectedVolunteer(volunteer);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </button>
                    {volunteer.status === 'pending' && (
                      <button
                        className="interview-button"
                        onClick={() => setInterviewModal({ open: true, volunteer })}
                      >
                        Schedule Caregiver Interview
                      </button>
                    )}
                    {volunteer.status === 'interviewing' && (
                      <>
                        <button
                          className="approve-button"
                          onClick={async () => {
                            await AuthService.updateVolunteerApprovalStatus(volunteer.volunteer_id, 'accepted', volunteer.email);
                            fetchVolunteers();
                          }}
                        >
                          Approve
                        </button>
                      <button
                        className="reject-button"
                          onClick={async () => {
                            await AuthService.updateVolunteerApprovalStatus(volunteer.volunteer_id, 'rejected', volunteer.email);
                            fetchVolunteers();
                          }}
                      >
                        Reject
                      </button>
                      </>
                    )}
                    {volunteer.status === 'accepted' && <span>Accepted</span>}
                    {volunteer.status === 'rejected' && <span>Rejected</span>}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(volunteer.volunteer_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Volunteer Details Modal */}
        {showModal && selectedVolunteer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Caregiver Details</h2>
                <button className="close-button" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <label>Full Name:</label>
                  <p>{selectedVolunteer.full_name}</p>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <p>{selectedVolunteer.email}</p>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <p>{selectedVolunteer.phone}</p>
                </div>
                <div className="detail-row">
                  <label>Location:</label>
                  <p>{selectedVolunteer.location}</p>
                </div>
                <div className="detail-row">
                  <label>Date of Birth:</label>
                  <p>{formatDate(selectedVolunteer.date_of_birth)}</p>
                </div>
                <div className="detail-row">
                  <label>Gender:</label>
                  <p>{selectedVolunteer.gender || 'Not specified'}</p>
                </div>
                <div className="detail-row">
                  <label>Specialization:</label>
                  <p>{selectedVolunteer.specialization || 'Not specified'}</p>
                </div>
                <div className="detail-row">
                  <label>Experience:</label>
                  <p>{selectedVolunteer.experience} years</p>
                </div>
                <div className="detail-row">
                  <label>Description:</label>
                  <p>{selectedVolunteer.description || 'No description provided'}</p>
                </div>
                <div className="detail-row">
                  <label>Availability:</label>
                  <p>{formatAvailability(selectedVolunteer.availability)}</p>
                </div>
                <div className="detail-row">
                  <label>Joined:</label>
                  <p>{formatDate(selectedVolunteer.created_at)}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="close-button" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {interviewModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Schedule Caregiver Interview for {interviewModal.volunteer.full_name}</h3>
                <button className="close-button" onClick={() => setInterviewModal(null)}>×</button>
              </div>
              <div className="modal-body">
                <input
                  type="date"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                />
                <input
                  type="time"
                  value={interviewTime}
                  onChange={e => setInterviewTime(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={handleScheduleInterview}
                  disabled={interviewLoading}
                >
                  {interviewLoading ? 'Scheduling...' : 'Confirm Interview'}
                </button>
                <button onClick={() => setInterviewModal(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminVolunteers; 