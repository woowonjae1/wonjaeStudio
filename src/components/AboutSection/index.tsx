"use client";

import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-visual">
          <div className="about-image-frame">
            <img
              src="/image/Romantic.jpg"
              alt="Romantic"
              className="about-image"
            />
          </div>
        </div>
        <div className="about-content">
          <span className="about-label">Featured Release</span>
          <h2 className="about-title">Romantic</h2>
          <p className="about-text">
            Written on Qixi Festival, this beat captures the essence of falling
            in love. Soft melodies intertwine with warm basslines, creating an
            intimate atmosphere that speaks to the heart. Let the rhythm guide
            you through moments of tenderness and the sweet anticipation of new
            beginnings.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Albums</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">40+</span>
              <span className="stat-label">Tracks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Plays</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
