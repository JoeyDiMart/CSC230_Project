import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import "./navbar.css";

function Navbar({ role, setRole, name, setName }) {
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    const navigate = useNavigate();


    return (
        <nav className="navbar">
            <div className="nav-items">
                <label htmlFor="menu-icon" className="menu-icon">
                    <input type="checkbox" id="menu-icon" checked={click} onChange={handleClick}/>
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
                
                {/* Conditional to activate the nav menu*/}
                <ul className={click? 'nav-menu active' : 'nav-menu'}>
                    <li><Link to="/Publications" onClick={closeMobileMenu}>Publications</Link></li>
                    <li><Link to="/Events" onClick={closeMobileMenu}>Events</Link></li>
                    <li><Link to="/Associates" onClick={closeMobileMenu}>Research Associates</Link></li>
                </ul>
                </div>

            {role === "guest" && (
                <div className="auth-buttons">
                    <button className="Login" onClick={() => navigate("/Login")}>Log in</button>
                    <button className="signup" onClick={() => navigate("/Signup")}>Sign up</button>
                </div>
            )}

            {role !== "guest" && (
                <div className="auth-buttons">

                    <button className="account-dropdown"> { name } </button>
                    <button className="signout" onClick= {() => role=setRole("guest")}>Sign Out</button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;