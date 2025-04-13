import React from "react";
import Navbar from "./navbar.jsx";
import "./header.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// header, has the navbar within it
function Header({ role, setRole, name, setName }) {
    return (
        <>
        <header className="header">
            <div className="branding">
                <Link to="/"><img src="/UTampa_mark.png" alt="Tampa img" className="logo" />  {/* UTampa Logo */}</Link>
                <Link to="/" className="brand-title"></Link>
            </div>
            <Navbar role={role} setRole={setRole} name={name} setName={setName}/>
        </header>
        </>
    );
}

export default Header;