import React, { useState, useRef, useEffect } from 'react';
import supabase from './supabaseClient';
import './VolunteerForm.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const specializations = [
  'Nurse',
  'Elderly Care',
  'Medical Student',
  'Physical Therapist Caregiver',
  'Part-time Worker'
];

const shiftOptions = [
  { key: 'day', start_time: '07:00', end_time: '19:00' },
  { key: 'night', start_time: '19:00', end_time: '07:00' },
  { key: 'full', start_time: '07:00', end_time: '07:00' },
];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialAvailability = {};
daysOfWeek.forEach(day => {
  initialAvailability[day] = {
    selected: false,
    day: { selected: false, wage: '' },
    night: { selected: false, wage: '' },
    full: { selected: false, wage: '' },
  };
});

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    lat: null,
    lng: null,
    experience: '',
    specialization: '',
    description: '',
    availability: initialAvailability,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityErrors, setAvailabilityErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [mapError, setMapError] = useState('');
  const mapRef = useRef();

  useEffect(() => {
    if (showMap && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 200);
    }
  }, [showMap]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateWage = (shift, wage) => {
    const numericWage = parseFloat(wage);
    if (isNaN(numericWage)) return ''; // No error if not a number yet or empty

    if (shift === 'Day Shift (7 AM - 7 PM)' && (numericWage < 30 || numericWage > 50)) {
      return 'Wage must be $30 - $50 inclusive for Day Shift.';
    }
    if (shift === 'Night Shift (7 PM - 7 AM)' && (numericWage < 50 || numericWage > 70)) {
      return 'Wage must be $50 - $70 inclusive for Night Shift.';
    }
    if (shift === 'Full Day (24 hours)' && (numericWage < 70 || numericWage > 100)) {
      return 'Wage must be $70 - $100 inclusive for Full Day.';
    }
    return ''; // No error
  };

  const handleAvailabilityChange = (day, shiftKey, field, value) => {
    setFormData(prevData => {
      const newAvailability = { ...prevData.availability };
      newAvailability[day] = { ...newAvailability[day] };
      newAvailability[day][shiftKey] = { ...newAvailability[day][shiftKey], [field]: value };
      return { ...prevData, availability: newAvailability };
    });
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setFormData((prev) => ({ ...prev, lat, lng, address }));
    setShowMap(false);
    setMapError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Check for validation errors before submitting
    const hasErrors = Object.values(availabilityErrors).some(error => error !== '');
    if (hasErrors) {
      setErrorMessage('Please correct the wage errors before submitting.');
      setIsLoading(false);
      return;
    }

    // Location validation
    if (!formData.address || !formData.lat || !formData.lng) {
      setErrorMessage('Please select your location on the map.');
      setIsLoading(false);
      return;
    }

    // Step 1: Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setErrorMessage(authError.message);
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
        setErrorMessage('Signup successful, but no user data returned. Please check your email to verify your account.');
        setIsLoading(false);
        return;
    }

    // Build availability array with only selected shifts
    const availabilityArr = [];
    for (const [day, shifts] of Object.entries(formData.availability)) {
      for (const opt of shiftOptions) {
        const shift = shifts[opt.key];
        if (shift.selected && shift.wage) {
          availabilityArr.push({
            day_of_week: day,
            shift_type: opt.key,
            start_time: opt.start_time,
            end_time: opt.end_time,
            wage: Math.round(Number(shift.wage)),
          });
        }
      }
    }

    const submissionData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: parseInt(formData.phone, 10),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        location: formData.address,
        latitude: formData.lat,
        longitude: formData.lng,
        experience: parseInt(formData.experience, 10),
        specialization: formData.specialization,
        description: formData.description,
        availability: availabilityArr,
    };

    const { error: insertError } = await supabase
      .from('volunteers')
      .insert([submissionData]);

    if (insertError) {
      setErrorMessage(`Could not save profile: ${insertError.message}`);
      setIsLoading(false);
      return;
    }

    setSuccessMessage('Registration successful! Please check your email to verify your account.');
    setFormData({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: '',
      lat: null,
      lng: null,
      experience: '',
      specialization: '',
      description: '',
      availability: initialAvailability,
    });
    setAvailabilityErrors({}); // Clear errors on success
  };

  // Helper to reverse geocode lat/lng to address
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      let address = data.display_name || '';
      // Format address to concise version (first 2–3 comma-separated parts)
      let parts = address.split(',').map(s => s.trim());
      // If the first part is a plus code (e.g., 68F4+54), keep it, otherwise skip
      if (/^[A-Z0-9+]{4,}/.test(parts[0])) {
        address = parts.slice(0, 3).join(', ');
      } else {
        address = parts.slice(0, 2).join(', ');
      }
      return address;
    } catch {
      return '';
    }
  };

  // Map click handler
  function LocationMarker({ onSelect }) {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const address = await fetchAddress(lat, lng);
        onSelect({ lat, lng, address });
      },
    });
    return formData.lat && formData.lng ? (
      <Marker position={[formData.lat, formData.lng]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
    ) : null;
  }

  return (
    <>
      <Navbar />
      <div className="volunteer-form-page">
        <div className="volunteer-form-container">
          <div className="volunteer-form-content">
            <h1>Become a Caregiver</h1>
            <p className="form-subtitle">Join our team and make a difference in someone's life.</p>
            
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Personal Information */}
                <div className="form-group">
                  <label htmlFor="full_name">Full Name</label>
                  <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="At least 6 characters" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input type="number" id="experience" name="experience" value={formData.experience} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="specialization">Specialization</label>
                  <select id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} required>
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
                
                {/* Location Section (updated) */}
                <div className="form-group full-width">
                  <label htmlFor="address">Address (select on map)</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    readOnly
                    required
                    placeholder="Click 'Select Location' to pick on map"
                  />
                  <button type="button" className="select-location-btn" onClick={() => setShowMap(true)}>
                    Select Location
                  </button>
                  {mapError && <div className="error-message">{mapError}</div>}
                </div>
                <div className="form-group full-width">
                  <label htmlFor="description">Brief Description (Experience, Skills, etc.)</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                
                {/* Availability Section */}
                <div className="form-group full-width">
                  <div className="availability-section">
                    <div className="availability-section-title">Availability & Wage (per shift):</div>
                    <div className="availability-days-grid">
                      {daysOfWeek.map(day => (
                        <div key={day} className="availability-day-card">
                          <div className="availability-day-title">
                            <input
                              type="checkbox"
                              checked={formData.availability[day].selected}
                              onChange={e => setFormData(prev => ({
                                ...prev,
                                availability: {
                                  ...prev.availability,
                                  [day]: {
                                    ...prev.availability[day],
                                    selected: e.target.checked
                                  }
                                }
                              }))}
                              id={`${day}-selected`}
                              className="modern-checkbox"
                            />
                            <label htmlFor={`${day}-selected`} style={{marginLeft: 6}}>{day}</label>
                          </div>
                          {formData.availability[day].selected && (
                            <div className="availability-shift-row">
                              {[{
                                label: 'Day Shift (7 AM - 7 PM)', key: 'day', hint: '($30 - $50)' },
                                { label: 'Night Shift (7 PM - 7 AM)', key: 'night', hint: '($50 - $70)' },
                                { label: 'Full (7 AM to 7 AM)', key: 'full', hint: '($70 - $100)' }
                              ].map(opt => (
                                <span key={opt.key} className="availability-shift-option">
                                  <input
                                    type="checkbox"
                                    checked={formData.availability[day][opt.key].selected}
                                    onChange={e => setFormData(prev => ({
                                      ...prev,
                                      availability: {
                                        ...prev.availability,
                                        [day]: {
                                          ...prev.availability[day],
                                          [opt.key]: {
                                            ...prev.availability[day][opt.key],
                                            selected: e.target.checked
                                          }
                                        }
                                      }
                                    }))}
                                    id={`${day}-${opt.key}`}
                                    className="modern-checkbox"
                                  />
                                  <label htmlFor={`${day}-${opt.key}`}>{opt.label}</label>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Wage"
                                    value={formData.availability[day][opt.key].wage}
                                    onChange={e => setFormData(prev => ({
                                      ...prev,
                                      availability: {
                                        ...prev.availability,
                                        [day]: {
                                          ...prev.availability[day],
                                          [opt.key]: {
                                            ...prev.availability[day][opt.key],
                                            wage: e.target.value
                                          }
                                        }
                                      }
                                    }))}
                                    disabled={!formData.availability[day][opt.key].selected}
                                    required={formData.availability[day][opt.key].selected}
                                    className="modern-wage-input"
                                  />
                                  <span className="wage-hint">{opt.hint}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
            {/* Map Modal */}
            {showMap && (
              <div className="map-modal-overlay">
                <div className="map-modal">
                  <button className="close-map-btn" onClick={() => setShowMap(false)}>Close</button>
                  <MapContainer
                    center={[33.8938, 35.5018]}
                    zoom={10}
                    style={{ height: 400, width: '100%' }}
                    whenCreated={mapInstance => { mapRef.current = mapInstance; }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker onSelect={handleLocationSelect} />
                  </MapContainer>
                  <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}>Click on the map to select your location.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VolunteerForm;