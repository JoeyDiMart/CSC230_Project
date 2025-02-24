import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "./navbar.css";

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="nav-items">
                <ul>
                    <li><Link to="/Publications">Publications</Link></li>
                    <li><Link to="/Events">Events</Link></li>
                    <li><Link to="/About">About Us</Link></li>
                    <li><Link to="/Associates">Research Associates</Link></li>
                </ul>
            </div>

            <div className="auth-buttons">
                <button className="Login" onClick={() => navigate("/Login")}>Log in</button>
                <button className="signup" onClick={() => navigate("/Signup")}>Sign up</button>
            </div>

        </nav>
    );
}

export default Navbar;