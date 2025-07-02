import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './Volunteer.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';

const Volunteer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    wagePerHour: '',
    specialization: '',
    availability: {
      monday: { isAvailable: false, startTime: '', endTime: '' },
      tuesday: { isAvailable: false, startTime: '', endTime: '' },
      wednesday: { isAvailable: false, startTime: '', endTime: '' },
      thursday: { isAvailable: false, startTime: '', endTime: '' },
      friday: { isAvailable: false, startTime: '', endTime: '' },
      saturday: { isAvailable: false, startTime: '', endTime: '' },
      sunday: { isAvailable: false, startTime: '', endTime: '' }
    }
  });

  const validateForm = () => {
    // Basic field validations
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 8-digit phone number');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.wagePerHour && isNaN(formData.wagePerHour)) {
      setError('Please enter a valid wage amount');
      return false;
    }

    // Availability validation
    const hasAvailability = Object.values(formData.availability).some(day => day.isAvailable);
    if (!hasAvailability) {
      setError('Please select at least one day of availability');
      return false;
    }

    // Validate time slots for each available day
    for (const [day, availability] of Object.entries(formData.availability)) {
      if (availability.isAvailable) {
        if (!availability.startTime || !availability.endTime) {
          setError(`Please fill in both start and end times for ${day}`);
          return false;
        }

        const startTime = new Date(`2000-01-01T${availability.startTime}`);
        const endTime = new Date(`2000-01-01T${availability.endTime}`);
        
        if (startTime >= endTime) {
          setError(`End time must be after start time for ${day}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly.slice(0, 8)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setError(null);
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // 1. Create auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('User creation failed');

      // 2. Create caregiver profile
      const { error: caregiverError } = await supabase
        .from('caregivers')
        .insert([{
          caregiver_id: user.id,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          wage_per_hour: formData.wagePerHour ? parseFloat(formData.wagePerHour) : null,
          specialization: formData.specialization,
          created_at: new Date().toISOString()
        }]);

      if (caregiverError) throw caregiverError;

      // 3. Create availability records
      const availabilityEntries = Object.entries(formData.availability)
        .filter(([, value]) => value.isAvailable)
        .map(([day, value]) => ({
          caregiver_id: user.id,
          day_of_week: day,
          start_time: value.startTime,
          end_time: value.endTime,
        }));

      if (availabilityEntries.length > 0) {
        const { error: availabilityError } = await supabase
          .from('caregiver_availability')
          .insert(availabilityEntries);

        if (availabilityError) throw availabilityError;
      }

      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="volunteer-page">
        <div className="volunteer-container">
          <div className="volunteer-content">
            <div className="volunteer-form-section">
              <div className="form-container">
                <h1>Volunteer Registration</h1>
                <p className="form-subtitle">
                  Join our compassionate community of caregivers and make a profound difference.
                </p>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="volunteer-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., 70123456"
                        maxLength="8"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="specialization">Specialization</label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g., Geriatric Care, Nursing"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="wagePerHour">Wage Per Hour (USD)</label>
                      <input
                        type="number"
                        id="wagePerHour"
                        name="wagePerHour"
                        value={formData.wagePerHour}
                        onChange={handleChange}
                        placeholder="e.g., 15.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="availability-section">
                    <h3>Availability</h3>
                    <p className="section-subtitle">Please select your available days and times</p>
                    
                    {Object.entries(formData.availability).map(([day, times]) => (
                      <div key={day} className="availability-day">
                        <div className="day-header">
                          <input
                            type="checkbox"
                            id={`available-${day}`}
                            checked={times.isAvailable}
                            onChange={(e) => handleAvailabilityChange(day, 'isAvailable', e.target.checked)}
                          />
                          <label htmlFor={`available-${day}`}>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                        </div>
                        
                        {times.isAvailable && (
                          <div className="time-inputs">
                            <div className="time-group">
                              <label htmlFor={`${day}-startTime`}>Start Time</label>
                              <input
                                type="time"
                                id={`${day}-startTime`}
                                value={times.startTime}
                                onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                required
                              />
                            </div>
                            <div className="time-group">
                              <label htmlFor={`${day}-endTime`}>End Time</label>
                              <input
                                type="time"
                                id={`${day}-endTime`}
                                value={times.endTime}
                                onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register as Volunteer'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Volunteer;