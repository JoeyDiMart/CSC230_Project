import React from "react";
import "./footer.css";

const footerSection = [
    { title: "Explore Content", subTitle: ["Advanced Search", "Search", "By Author", "By Subject", "Collection", "Images"] },
    { title: "Help Center", subTitle: ["FAQ", "Get Support", "Get Access", "Contact Us"] },
    { title: "Legal", subTitle: ["Terms & Conditions", "Privacy Policy", "Accessibility", "Cookie Policy", "Cookie Settings"] },
];

function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-sections">
                {footerSection.map((section, index) => (
                    <div key={index} className="footer-column">
                        <h6 className="footer-title">{section.title}</h6>
                        <ul className="footer-list">
                            {section.subTitle.map((subTitle, i) => (
                                <li key={i} className="footer-item">
                                    {subTitle}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {/* Subscribe Section */}
                <div className="subscribe-section">
                    <h6 className="footer-title">Want to stay up to date?</h6>
                    <p className="subscribe-description">
                        The latest publications, CIRT events, updates, and information sent to your email.
                    </p>
                    <form className="subscribe-form">
                        <input
                            type="email"
                            placeholder="Enter email address"
                            className="subscribe-input"
                        />
                        <button className="subscribe-button">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
                <div className="social-icons">
                    <a href="https://www.instagram.com/uoftampa/" target="_blank" rel="noopener noreferrer">
                        <img src="/instagram.svg" alt="Instagram" className="social-icon" />
                    </a>
                    <a href="https://x.com/UofTampa" target="_blank" rel="noopener noreferrer">
                        <img src="/x.svg" alt="X" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/company/utampa-criminology-criminal-justice/" target="_blank" rel="noopener noreferrer">
                        <img src="/linkedin.svg" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://www.tiktok.com/@uoftampa" target="_blank" rel="noopener noreferrer">
                        <img src="/tik_tok.svg" alt="TikTok" className="social-icon" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Footer;
