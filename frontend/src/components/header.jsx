import React from "react";
import Navbar from "./navbar.jsx";
import "./header.css";
import { Link } from "react-router-dom";

// header, has the navbar within it
function Header() {
    return (
        <>
        <header className="header">
            <div className="branding">
                <a href="/">
                    <img src="/UTampa_mark.png" alt="Tampa img" className="logo" />  {/* UTampa Logo */}
                </a>
                <Link to="/" className="brand-title">
                    <h1>CIRT</h1>
                </Link>
            </div>
            <Navbar />  {/* Add navbar to header */}
        </header>
        <h1>Criminology Institute for Research and Training</h1>
        </>
    );
}

export default Header;