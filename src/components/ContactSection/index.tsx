"use client";

import "./ContactSection.css";

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <span className="contact-label">Get in Touch</span>
        <h2 className="contact-title">Let's Create Together</h2>
        <p className="contact-text">
          For collaborations, licensing inquiries, or just to say hello — feel
          free to reach out. Every great project starts with a conversation.
        </p>
        <a href="mailto:woowonjae0827@outlook.com" className="contact-email">
          woowonjae0827@outlook.com
        </a>
        <div className="contact-social">
          <a href="#" className="social-link">
            SoundCloud
          </a>
          <a href="#" className="social-link">
            Spotify
          </a>
          <a href="#" className="social-link">
            YouTube
          </a>
        </div>
        <div className="footer">
          <p className="footer-text">© 2025 WOOWONJAE. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
