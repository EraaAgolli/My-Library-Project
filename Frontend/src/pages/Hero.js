import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";
import "./../components/Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-image"></div>
      <div className="hero-overlay"></div>

      {/* Hero content */}
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Next Chapter Starts Here
          </h1>
          <p className="hero-subtitle">
            Explore timeless classics and modern favorites. Borrow, reserve, or add to your wishlist —
            all in one seamless library experience.
          </p>
          <div className="hero-actions">
            <Link to="/book-shop">
              <button className="cta-btn">
                Explore Catalog
                <span className="icon"><GoArrowRight /></span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
