import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import caregiverwithelderly from '../images/caregiverwithelderly.png';
import caregivertalking from '../images/caregivertalking.png';
import './AboutUs.css';

const AboutUs = () => {
  const values = [
    {
      icon: "❤️",
      title: "Compassion",
      description: "We treat every senior with the care and respect they deserve, just as we would our own family members."
    },
    {
      icon: "🤝",
      title: "Reliability",
      description: "Our dedicated team is committed to providing consistent, dependable care that you can count on."
    },
    {
      icon: "⭐",
      title: "Excellence",
      description: "We strive for excellence in everything we do, from caregiver training to personalized care plans."
    },
    {
      icon: "🏆",
      title: "Integrity",
      description: "We maintain the highest standards of professionalism and ethical conduct in all our interactions."
    }
  ];

  const stats = [
    { number: "1000+", label: "Seniors Cared For" },
    { number: "200+", label: "Professional Caregivers" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About GrandGuard</h1>
          <p className="hero-subtitle">
            Providing Compassionate Care for Seniors Since 2008
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
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <h3>{stat.number}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mission-image">
              <img src={caregiverwithelderly} alt="Caregiver with elderly person" />
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
              <img src={caregivertalking} alt="Caregiver talking with family" />
            </div>
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2008, GrandGuard began with a simple yet powerful vision:
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
              Become a Volunteer
            </a>
            <a href="/contact" className="secondary-button">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs; 