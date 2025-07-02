import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import './AdminTables.css';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import AdminFooter from '../Footer/AdminFooter';

function parseDateTime(dateTimeStr) {
  // Example input: "7/1/2025, 5:00:00 PM"
  const [datePart, timePart] = dateTimeStr.split(',');
  if (!datePart || !timePart) return new Date(dateTimeStr); // fallback
  const [month, day, year] = datePart.trim().split('/').map(Number);
  let [time, ampm] = timePart.trim().split(' ');
  let [hour, minute, second] = time.split(':').map(Number);
  if (ampm && ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return new Date(year, month - 1, day, hour, minute, second);
}

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        // Fetch interviews and join with volunteers
        const { data, error } = await supabase
          .from('interviews')
          .select('id, scheduled_time, status, zoom_join_url, zoom_start_url, volunteer_id, volunteers(full_name, email)')
          .order('scheduled_time', { ascending: true });
        if (error) throw error;
        setInterviews(data);
      } catch (err) {
        setError('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setInterviews((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOrder = { scheduled: 0, completed: 1, canceled: 2 };
  const now = new Date();
  const sortedInterviews = [...interviews].sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (a.status === 'scheduled' && b.status === 'scheduled') {
      const aTime = parseDateTime(a.scheduled_time).getTime();
      const bTime = parseDateTime(b.scheduled_time).getTime();
      // Both in the future
      if (aTime >= now.getTime() && bTime >= now.getTime()) {
        return aTime - bTime;
      }
      // Only one in the future
      if (aTime >= now.getTime()) return -1;
      if (bTime >= now.getTime()) return 1;
      // Both in the past, most recent past first
      return bTime - aTime;
    }
    // For completed/canceled, most recent first
    return parseDateTime(b.scheduled_time).getTime() - parseDateTime(a.scheduled_time).getTime();
  });

  if (loading) return <div className="loading">Loading interviews...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-table-page">
        <div className="table-header">
          <h1>Manage Interviews</h1>
        </div>
        <div className="table-container">
          {interviews.length === 0 ? (
            <div className="no-data-message">No interviews scheduled yet.</div>
          ) : (
          <table className="admin-table responsive-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Caregiver</th>
                <th>Email</th>
                <th>Status</th>
                <th>Zoom Join Link</th>
                <th>Zoom Start Link</th>
              </tr>
            </thead>
            <tbody>
              {sortedInterviews.map((interview) => {
                const now = new Date();
                const scheduled = new Date(interview.scheduled_time);
                const canMarkCompleted = now - scheduled >= 30 * 60 * 1000;
                return (
                  <tr key={interview.id}>
                    <td>{scheduled.toLocaleDateString()}</td>
                    <td>{scheduled.toLocaleTimeString()}</td>
                    <td>{interview.volunteers?.full_name || 'N/A'}</td>
                    <td>{interview.volunteers?.email || 'N/A'}</td>
                    <td>
                      <select
                        value={interview.status}
                        onChange={e => handleStatusChange(interview.id, e.target.value)}
                        disabled={updatingId === interview.id}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed" disabled={!canMarkCompleted}>Completed</option>
                        <option value="canceled">Canceled</option>
                      </select>
                      {!canMarkCompleted && (
                        <div className="status-tooltip" style={{ color: '#c62828', fontSize: '0.85rem' }}>
                          You can only mark as completed 30 minutes after the session starts.
                        </div>
                      )}
                    </td>
                    <td>
                      <a href={interview.zoom_join_url} target="_blank" rel="noopener noreferrer">Join Link</a>
                      <button onClick={() => navigator.clipboard.writeText(interview.zoom_join_url)} className="copy-btn">Copy</button>
                    </td>
                    <td>
                      {interview.status === 'scheduled' ? (
                        <>
                          <a href={interview.zoom_start_url} target="_blank" rel="noopener noreferrer" className="start-btn">Start Meeting</a>
                          <button onClick={() => navigator.clipboard.writeText(interview.zoom_start_url)} className="copy-btn">Copy</button>
                        </>
                      ) : (
                        <button className="start-btn disabled" disabled>
                          {interview.status === 'completed' ? 'Meeting Completed' : 'Canceled'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminInterviews; 