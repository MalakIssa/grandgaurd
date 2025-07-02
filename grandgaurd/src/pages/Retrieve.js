import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './Retrieve.css'; // Create this CSS file for styling

const Retrieve = () => {
  const navigate = useNavigate();
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempAvailability, setTempAvailability] = useState({});

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour] = timeStr.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12; // The hour '0' should be '12'
    return `${h}${ampm}`;
  };

  useEffect(() => {
    const fetchCaregiverData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('caregivers')
          .select('*')
          .eq('caregiver_id', user.id)
          .single();

        if (error) throw error;

        setCaregiver(data);
        setTempAvailability(data.availability || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverData();
  }, [navigate]);

  const handleAvailabilityChange = (day, field, value) => {
    setTempAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('caregivers')
        .update({ availability: tempAvailability })
        .eq('caregiver_id', user.id);

      if (error) throw error;

      setCaregiver(prev => ({ ...prev, availability: tempAvailability }));
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="no-data">
        <h2>No Caregiver Data Found</h2>
        <p>Please complete your registration</p>
      </div>
    );
  }

  return (
    <div className="retrieve-container">
      <div className="profile-header">
        <h1>Your Caregiver Profile</h1>
        {/* Edit button can be added back later if needed */}
      </div>

      <div className="profile-card">
        <div className="personal-info">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name:</label>
              <p>{caregiver.full_name}</p>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <p>{caregiver.email}</p>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <p>{caregiver.phone}</p>
            </div>
            <div className="info-item">
              <label>Gender:</label>
              <p>{caregiver.gender || 'Not specified'}</p>
            </div>
            <div className="info-item">
              <label>Date of Birth:</label>
              <p>{caregiver.date_of_birth || 'Not specified'}</p>
            </div>
            <div className="info-item">
              <label>Specialization:</label>
              <p>{caregiver.specialization || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="availability-section">
          <h2>Your Availability</h2>
          <div className="availability-display">
            {caregiver.availability && caregiver.availability.length > 0 ? (
              caregiver.availability.map((slot, index) => (
                <div key={index} className="day-card">
                  <h3>{slot.day_of_week}</h3>
                  <div className="time-slots">
                    <span className="time">{slot.shift_type} shift ({formatTime(slot.start_time)} - {formatTime(slot.end_time)})</span>
                    <span className="wage-display">${slot.wage}/hr</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-availability">No availability set yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retrieve;