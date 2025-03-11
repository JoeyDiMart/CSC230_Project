import React from "react";
import Navbar from "./navbar.jsx";
import "./header.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// header, has the navbar within it
function Header() {
    return (
        <>
        <header className="header">
            <div className="branding">
                <Link to="/"><img src="/UTampa_mark.png" alt="Tampa img" className="logo" />  {/* UTampa Logo */}</Link>
                <Link to="/" className="brand-title"></Link>
            </div>
            <Navbar /> {/* Add navbar to header */}
        </header>
        <h1>Criminology Institute for Research and Training</h1>
        </>
    );
}

export default Header;