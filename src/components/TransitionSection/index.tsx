"use client";

import "./TransitionSection.css";

const TransitionSection = () => {
  return (
    <section className="transition-section">
      <div className="transition-fade" />
      <div className="transition-content">
        <div className="transition-quote">
          <span className="quote-mark">"</span>
          <p className="quote-text">Music is the space between the notes</p>
          <span className="quote-author">— Claude Debussy</span>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  );
};

export default TransitionSection;
