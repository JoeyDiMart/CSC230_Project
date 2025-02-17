import React from "react";
import "./navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
        <div className="nav-items">
            <a href="/">Home</a>
            <a href="/Publications">Publications</a>
            <a href="/Events">Events</a>
            <a href="/About">About Us</a>
            <a href="/Associates">Research Associates</a>
        </div>

        <div className="auth-buttons">
            <button className="login">Log in</button>
            <button className="signup">Sign up</button>
        </div>
        </nav>
    );
}

export default Navbar;