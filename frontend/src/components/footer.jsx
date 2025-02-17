import React from "react";
import "./footer.css";

// bottom of the page
function Footer() {
    return (
        <footer className="footer">
            <img src="/plant_hall.png" alt="Plant Hall img" className="logo" />  {/* Plant Hall Logo */}
            <div className="social-links">
                <h2>Social Media</h2>
                <a href="https://www.instagram.com/uoftampa/" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.svg" alt="Instagram" />
                </a>
            </div>
            <div className="footer-items">
                <h2>Contact Us</h2>
                <h2>FAQs</h2>
                <h2>Resources</h2>
            </div>
        </footer>
    );
}

export default Footer;