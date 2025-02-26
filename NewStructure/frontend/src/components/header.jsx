import React from "react";
import Navbar from "./navbar.jsx";
import "./header.css";

// header, has the navbar within it
function Header() {
    return (
        <>
        <header className="header">
            <a href="/">
                <img src="/UTampa_mark.png" alt="Tampa img" className="logo" />  {/* UTampa Logo */}
            </a>
            <Navbar />  {/* Add navbar to header */}
        </header>
        <h1>Criminology Institute for Research and Training</h1>
        </>
    );
}

export default Header;