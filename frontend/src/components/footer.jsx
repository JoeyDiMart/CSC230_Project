import React, { useState } from "react";
import "./footer.css";

const footerSection = [
    {
        title: "Explore Content",
        subTitle: [
            { text: "Search for Publication", link: "/Publications" },
            { text: "By Title", link: "/Publications" },
            { text: "By Author", link: "/Publications" },
            { text: "By Keyword", link: "/Publications" }
        ]
    },
    {
        title: "Legal",
        subTitle: [
            { text: "Terms & Conditions" },
            { text: "Privacy Policy" },
            { text: "Accessibility" },
            { text: "Cookie Policy" },
            { text: "Cookie Settings" }
        ]
    },
    {
        title: "Help Center",
        subTitle: [
            { text: "FAQ" },
            { text: "Get Access" },
            { text: "Contact Us" }
        ]
    }
];

const modalContent = {
    "Terms & Conditions": "By using this website, you agree to abide by our terms and conditions, which govern your access to and use of our services. Continued use of the site signifies your acceptance of these terms.",
    "Privacy Policy": "Your privacy is important to us. We collect and use personal data responsibly and transparently in accordance with applicable laws and best practices.",
    "Accessibility": "We are committed to ensuring our website is accessible to everyone, including individuals with disabilities. We continuously work to improve accessibility features.",
    "Cookie Policy": "This website uses cookies to enhance the user experience and analyze website traffic. By continuing to browse the site, you consent to our use of cookies.",
    "Cookie Settings": "Manage your cookie preferences below. Essential cookies are required for the site to function, but others can be customized to fit your needs.",
    "FAQ": "Q:  A: ",
    "Get Access": "Interested in accessing more content or features? Some areas of the website may require a login.",
    "Contact Us": "Criminology Institute for Research and Training (CIRT) 401 W. Kennedy Blvd. Tampa, FL 33606-1490",
};

function Footer() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");

    const handleModalOpen = (title) => {
        if (!modalContent[title]) return;
        setModalTitle(title);
        setModalText(modalContent[title] || "Content coming soon.");
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setModalTitle("");
        setModalText("");
    };

    return (
        <div className="footer-container bg-testingColorOutline">
            <div className="footer-sections">
                {footerSection.map((section, index) => (
                    <div key={index} className="footer-column">
                        <h6 className="footer-title">{section.title}</h6>
                        <ul className="footer-list">
                            {section.subTitle.map((sub, i) => (
                                <li key={i} className="footer-item">
                                    {sub.link ? (
                                        <a href={sub.link} className="footer-link">
                                            {sub.text}
                                        </a>
                                    ) : (
                                        <span
                                            onClick={() => handleModalOpen(sub.text)}
                                            className="footer-link"
                                        >
                                            {sub.text}
                                        </span>
                                    )}
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
                        <button className="sub-button">
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
                    <a
                        href="https://www.linkedin.com/company/utampa-criminology-criminal-justice/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/linkedin.svg" alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://www.tiktok.com/@uoftampa" target="_blank" rel="noopener noreferrer">
                        <img src="/tik_tok.svg" alt="TikTok" className="social-icon" />
                    </a>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{modalTitle}</h2>
                        <p className="modal-text">{modalText}</p>
                        <button className="modal-close" onClick={handleModalClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Footer;
