import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForVolunteer.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';

const ForVolunteer = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/caregiver/form');
  };

  return (
    <>
      <Navbar />
      <div className="volunteer-page">
        <div className="volunteer-container">
          <div className="volunteer-content">
            <div className="volunteer-info">
              <h1>Become a Caregiver</h1>
              <p className="subtitle">Make a Difference in Someone's Life</p>
              <p className="description">
                Join our community of compassionate individuals helping elderly people 
                receive the care and companionship they deserve. As a caregiver, you'll have 
                the opportunity to make a real difference in the lives of seniors while gaining 
                valuable experience in healthcare and elderly care.
              </p>
              <div className="requirements">
                <h3>Requirements:</h3>
                <ul>
                  <li>Must be 20 years or older</li>
                  <li>Willing to undergo background check</li>
                  <li>Commit minimum 4 hours daily</li>
                  <li>Compassionate and patient nature</li>
                </ul>
              </div>

              <div className="benefits">
                <h3>Benefits of Being a Caregiver:</h3>
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForVolunteer;