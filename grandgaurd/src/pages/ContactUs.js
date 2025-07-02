import React, { useState } from 'react';
import caregiverImage from '../images/servicesofcaregiver.jpg';
import './ContactUs.css';
import supabase from './supabaseClient';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contactUs')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      setSuccessMessage('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' }); // Clear form

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-content">
            {/* Left side - Image */}
            <div className="contact-image-section">
              <img 
                src={caregiverImage} 
                alt="Professional caregiving services"
                className="contact-image"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <h2>Get in Touch</h2>
                  <p>We're here to help and answer any questions you might have</p>
                </div>
              </div>
            </div>

            {/* Right side - Contact Form */}
            <div className="contact-form-section">
              <div className="form-container">
                <h1>Contact Us</h1>
                <p className="form-subtitle">
                  Send us a message and we'll get back to you as soon as possible
                </p>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="contact-form">
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
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
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

export default ContactUs;
