import React from "react";
import Navbar from "./navbar.jsx";
import "./header.css";

function Header() {
    return (
        <header className="header">
            <h1>Welcome!</h1>
            <img src="/UTampa_mark.png" alt="Tampa Logo" className="logo" />
            <Navbar />
            <div className="auth-buttons">
                <button className="login">Log in</button>
                <button className="signup">Sign up</button>
            </div>
        </header>
    );
}

export default Header;