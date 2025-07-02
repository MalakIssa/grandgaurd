import React, { useEffect, useState } from 'react';
import caregiverwithelderperson from '../images/caregiverwithelderperson.jpg';
import caregivertalketo from '../images/caregivertalketo.jpg';
import heart from '../images/heart.png';
import handshake from '../images/handshake.png';
import star from '../images/star.png';
import trophy from '../images/trophy.png';
import './AboutUs.css';
import supabase from './supabaseClient';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';

const AboutUs = () => {
  const [clientCount, setClientCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact' });
      const { count: volunteersCount } = await supabase.from('volunteers').select('*', { count: 'exact' });
      setClientCount(clientsCount || 0);
      setVolunteerCount(volunteersCount || 0);
    }
    fetchCounts();
  }, []);

  const values = [
    {
      icon: <img src={heart} alt="Compassion" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Compassion",
      description: "We treat every senior with the care and respect they deserve, just as we would our own family members."
    },
    {
      icon: <img src={handshake} alt="Reliability" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Reliability",
      description: "Our dedicated team is committed to providing consistent, dependable care that you can count on."
    },
    {
      icon: <img src={star} alt="Excellence" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from caregiver training to personalized care plans."
    },
    {
      icon: <img src={trophy} alt="Integrity" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Integrity",
      description: "We maintain the highest standards of professionalism and ethical conduct in all our interactions."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>About GrandGuard</h1>
            <p className="hero-subtitle">
              Providing Compassionate Care for Seniors 
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-content">
              <div className="mission-text">
                <h2>Our Mission</h2>
                <p>
                  At GrandGuard, our mission is to enhance the quality of life for seniors
                  by providing compassionate, professional care that enables them to maintain
                  their independence and dignity in the comfort of their own homes.
                </p>
                <div className="stats-grid" style={{display: 'flex', gap: '2rem', margin: '2rem 0'}}>
                  <div className="stat-card" style={{flex: 1, background: '#f8f9fa', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <span style={{fontWeight: 700, fontSize: '2.5rem', color: '#ee9d3a'}}> {clientCount}+ </span>
                    <span style={{color: '#0c5d67', fontWeight: 500, fontSize: '1.2rem', textAlign: 'center'}}>Seniors Cared For</span>
                  </div>
                  <div className="stat-card" style={{flex: 1, background: '#f8f9fa', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <span style={{fontWeight: 700, fontSize: '2.5rem', color: '#ee9d3a'}}> {volunteerCount}+ </span>
                    <span style={{color: '#0c5d67', fontWeight: 500, fontSize: '1.2rem', textAlign: 'center'}}>Professional Caregivers</span>
                  </div>
                </div>
              </div>
              <div className="mission-image">
                <img src={caregiverwithelderperson} alt="Caregiver with elderly person" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <h2>Our Core Values</h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-image">
                <img src={caregivertalketo} alt="Caregiver talking with family" />
              </div>
              <div className="story-text">
                <h2>Our Story</h2>
                <p>
                   GrandGuard began with a simple yet powerful vision:
                  to provide seniors with the highest quality of care while maintaining
                  their independence and dignity. What started as a small team of
                  dedicated caregivers has grown into a trusted network of professionals,
                  all united by our commitment to excellence in senior care.
                </p>
                <p>
                  Today, we continue to build on our foundation of compassionate care,
                  incorporating the latest best practices and technologies while never
                  losing sight of the personal touch that makes our service special.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section className="join-section">
          <div className="container">
            <h2>Join Our Team</h2>
            <p>
              We're always looking for compassionate individuals to join our team of
              dedicated caregivers. Make a difference in seniors' lives while building
              a rewarding career.
            </p>
            <div className="join-buttons">
              <a href="/volunteer" className="primary-button">
                Become a Caregiver
              </a>
            
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;