import React from "react";
import Navbar from "./navbar.jsx";
import "./header.css";

// header, has the navbar within it
function Header() {
    return (
        <header className="header">
            <img src="/UTampa_mark.png" alt="Tampa img" className="logo" />  {/* UTampa Logo */}
            <Navbar />  {/* Add navbar to header */}
        </header>
    );
}

export default Header;