import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';
import './createCaregiverForm.css';

const CreateCaregiverForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    specialization: '',
    description: '',
    experience: '',
    location: '',
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

  const locations = [
    'Beirut',
    'Mount Lebanon',
    'North Lebanon',
    'South Lebanon',
    'Bekaa',
    'Nabatieh',
    'Akkar',
    'Baalbek-Hermel'
  ];

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password || !formData.phone) {
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

    if (!formData.location) {
      setError('Please select your location');
      return false;
    }

    const hasAvailability = Object.values(formData.availability).some(day => day.isAvailable);
    if (!hasAvailability) {
      setError('Please select at least one day of availability');
      return false;
    }

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

    try {
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        throw signUpError;
      }

      if (!authData?.user?.id) {
        console.error('No user ID received from auth:', authData);
        throw new Error('User creation failed - no user ID received');
      }

      // 2. Prepare availability data
      const availabilityArray = Object.entries(formData.availability)
        .filter(([_, times]) => times.isAvailable)
        .map(([day, times]) => ({
          day_of_week: day,
          start_time: times.startTime,
          end_time: times.endTime
        }));

      // 3. Insert volunteer data with availability
      const { error: volunteerError } = await supabase
        .from('volunteers')
        .insert([{
          volunteer_id: authData.user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender || null,
          date_of_birth: formData.date_of_birth || null,
          specialization: formData.specialization || null,
          description: formData.description || null,
          experience: formData.experience ? parseInt(formData.experience) : null,
          location: formData.location,
          role: 'volunteer',
          availability: availabilityArray,
          created_at: new Date().toISOString()
        }]);

      if (volunteerError) {
        console.error('Volunteer insert error:', volunteerError);
        throw volunteerError;
      }

      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/'), 3000);

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message?.includes('duplicate key')) {
        setError('An account with this email already exists.');
      } else if (error.message?.includes('invalid input syntax')) {
        setError('There was an issue with the data format. Please check all fields.');
      } else if (error.message?.includes('violates not-null constraint')) {
        setError('Please fill in all required fields.');
      } else {
        setError(error.message || 'Error creating account. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="caregiver-page">
      <Navbar />
      <div className="caregiver-container">
        <div className="caregiver-content">
          <div className="caregiver-form-section">
            <div className="form-container">
              <h1>Caregiver Registration</h1>
              <p className="form-subtitle">
                Join our team of dedicated caregivers and make a difference
              </p>

              {error && <div className="error-message">{error}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <form onSubmit={handleSubmit} className="caregiver-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="full_name">Full Name *</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
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
                      placeholder="Enter your email"
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
                      placeholder="Choose a strong password"
                      required
                    />
                    <small className="password-requirements">
                      Password must be at least 8 characters long
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your 8-digit phone number"
                      pattern="[0-9]{8}"
                      title="Please enter exactly 8 digits"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <div className="gender-options">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleChange}
                        />
                        Male
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleChange}
                        />
                        Female
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_of_birth">Date of Birth</label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialization">Specialization</label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    >
                      <option value="">Select specialization</option>
                      <option value="elderly-care">Elderly Care</option>
                      <option value="medical-assistance">Medical Assistance</option>
                      <option value="physical-therapy">Physical Therapy</option>
                      <option value="companion-care">Companion Care</option>
                      <option value="dementia-care">Dementia Care</option>
                      <option value="hospice-care">Hospice Care</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">Years of Experience</label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Enter years of experience"
                      min="0"
                      step="1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about yourself and your experience"
                      rows="4"
                    />
                  </div>
                </div>

                <div className="availability-section">
                  <h3>Availability Schedule</h3>
                  <p>Select all days you're available and specify time slots</p>
                  <div className="availability-grid">
                    {Object.entries(formData.availability).map(([day, value]) => (
                      <div key={day} className="day-availability">
                        <div className="day-header">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={value.isAvailable}
                              onChange={(e) => handleAvailabilityChange(day, 'isAvailable', e.target.checked)}
                            />
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </label>
                        </div>
                        {value.isAvailable && (
                          <div className="time-inputs">
                            <div className="time-field">
                              <label>From</label>
                              <input
                                type="time"
                                value={value.startTime}
                                onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                required
                              />
                            </div>
                            <div className="time-field">
                              <label>To</label>
                              <input
                                type="time"
                                value={value.endTime}
                                onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCaregiverForm;
