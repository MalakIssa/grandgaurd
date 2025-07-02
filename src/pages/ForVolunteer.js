import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';
import './ForVolunteer.css';

const ForVolunteer = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/volunteer/form');
  };

  return (
    <div className="volunteer-page">
      <Navbar />
      
      <div className="volunteer-container">
        <div className="volunteer-content">
          {/* Left side - Information */}
          <div className="volunteer-info">
            <h1>Become a Volunteer</h1>
            <p className="subtitle">Make a Difference in Someone's Life</p>
            <p className="description">
              Join our community of compassionate individuals helping elderly people 
              receive the care and companionship they deserve. As a volunteer, you'll have 
              the opportunity to make a real difference in the lives of seniors while gaining 
              valuable experience in healthcare and elderly care.
            </p>
            <div className="requirements">
              <h3>Requirements:</h3>
              <ul>
                <li>Must be 18 years or older</li>
                <li>Willing to undergo background check</li>
                <li>Commit minimum 4 hours weekly</li>
                <li>Compassionate and patient nature</li>
              </ul>
            </div>

            <div className="benefits">
              <h3>Benefits of Volunteering:</h3>
              <ul>
                <li>Make a meaningful impact in seniors' lives</li>
                <li>Gain valuable healthcare experience</li>
                <li>Flexible scheduling options</li>
                <li>Professional development opportunities</li>
                <li>Be part of a supportive community</li>
              </ul>
            </div>

            <button onClick={handleApplyNow} className="apply-button">
              Apply Now
              <span className="arrow-icon">→</span>
            </button>
          </div>

          {/* Right side - Image or Additional Content */}
          <div className="volunteer-image-container">
            <div className="image-overlay">
              <div className="stat-box">
                <h4>200+</h4>
                <p>Active Volunteers</p>
              </div>
              <div className="stat-box">
                <h4>1000+</h4>
                <p>Seniors Helped</p>
              </div>
              <div className="stat-box">
                <h4>50+</h4>
                <p>Partner Facilities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForVolunteer; 