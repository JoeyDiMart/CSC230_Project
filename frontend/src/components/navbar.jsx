import { useNavigate } from "react-router-dom";
import React from "react";
import "./navbar.css";

function Navbar() {
    const navigate = useNavigate();
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
            <button className="Login" onClick={() => navigate("/Login")}>Log in</button>
            <button className="signup" onClick={() => navigate("/Signup")}>Sign up</button>
        </div>
        </nav>
    );
}

export default Navbar;