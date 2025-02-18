import React from "react";
import "./footer.css";

// bottom of the page
function Footer() {
    return (
        <footer className="footer">
            <img src="/plant_hall.png" alt="Plant Hall img" className="logo" />  {/* Plant Hall Logo */}
            <div className="social-links">
                <h3>Social Media</h3>
                <a href="https://www.instagram.com/uoftampa/" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.svg" alt="Instagram" />
                </a>
            </div>
            <div className="footer-items">
                <h3>Contact Us</h3>
                <h3>FAQs</h3>
                <h3>Resources</h3>
            </div>
        </footer>
    );
}

export default Footer;