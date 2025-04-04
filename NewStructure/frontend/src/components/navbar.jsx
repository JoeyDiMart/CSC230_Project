import { Link, useNavigate } from "react-router-dom";
import React from "react";
import {useRef ,useState, useEffect } from "react";
import "./navbar.css";


function Navbar({ role, setRole, name, setName }) {
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    // Event listnener to close dropdown menu
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);


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
                <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profile-button" onClick={() => setDropdownOpen((prev) => !prev)}>{name}</button>

                {isDropdownOpen && (
                    <ul className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
                        <li>
                            <Link to="/Account" onClick={() => setDropdownOpen(false)}>Account</Link>
                        </li>
                        <li>
                            <Link to="/Dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                        </li>
                    </ul>
                )}
                </div>
                <button className="signout" onClick={() => setRole("guest")}>
                Sign Out
                </button>
            </div>
            )}
        </nav>
    );
}

export default Navbar;