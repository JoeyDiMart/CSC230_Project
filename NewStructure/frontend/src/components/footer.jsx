import React from "react";
import "./footer.css";

// bottom of the page
function Footer() {
    return (
        <footer className="footer">
            <a href="https://www.ut.edu/" target="_blank" rel="noopener noreferrer">
                <img src="/plant_hall.png" alt="Plant Hall" />
            </a>
            <div className="footer-items">
                <h3>Contact Us</h3>
                <h3>FAQs</h3>
                <h3>Resources</h3>
                <h3>Mission Statement</h3>
            </div>
            <div className="social-links">
                <h3>Let's connect!</h3>
                <a href="https://www.instagram.com/uoftampa/" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.svg" alt="Instagram" />
                </a>
                <a href="https://x.com/UofTampa" target="_blank" rel="noopener noreferrer">
                    <img src="/x.svg" alt="X" />
                </a>
                <a href="https://www.linkedin.com/company/utampa-criminology-criminal-justice/" target="_blank" rel="noopener noreferrer">
                    <img src="/linkedin.svg" alt="Linkedin" />
                </a>
                <a href="https://www.tiktok.com/@uoftampa" target="_blank" rel="noopener noreferrer">
                    <img src="/tik_tok.svg" alt="Tik Tok" />
                </a>
            </div>
        </footer>
    );
}

export default Footer;