"use client";

import { useState, useEffect } from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${!isLoading ? "fade-out" : ""}`}>
      <div className="loading-content">
        <h1 className="loading-logo">WOOWONJAE</h1>
        <div className="loading-bars">
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
