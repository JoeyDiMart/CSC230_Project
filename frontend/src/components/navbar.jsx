import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useRef, useState, useEffect } from "react";
import "./navbar.css";

function Navbar({ role, setRole, name, setName, setEmail }) {
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
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
        <nav className="navbar ">
            <div className="branding">
                <Link to="/"><img src="/UTampa_mark.png" alt="Tampa img" className="logo" />  {/* UTampa Logo */}</Link>
                <Link to="/" className="brand-title"></Link>
            </div>
            <div className="nav-items">
                <label htmlFor="menu-icon" className="menu-icon">
                    <input type="checkbox" id="menu-icon" checked={click} onChange={handleClick}/>
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
                
                <ul className={click ? 'nav-menu active ' : 'nav-menu'}>
                    <li className="font-bold"><Link to="/Publications" onClick={closeMobileMenu}>Publications</Link></li>
                    <li><Link to="/posters" onClick={closeMobileMenu}>Posters</Link></li>
                    <li><Link to="/Events" onClick={closeMobileMenu}>Events</Link></li>
                    <li><Link to="/Research-Associates" onClick={closeMobileMenu}>Research Associates</Link></li>
                    <li><Link to="/fellow" onClick={closeMobileMenu}>Fellowship</Link></li> {/* New link */}

                </ul>
            </div>

            {role === "guest" && (
                <div className="auth-buttons">
                    <button className="Login text-testingColorWhite " onClick={() => navigate("/Login")}>Log in</button>
                    <button className="signup text-testingColorWhite" onClick={() => navigate("/Signup")}>Sign up</button>
                </div>
            )}

            {role !== "guest" && (
                <div className="auth-buttons">
                    <div className="profile-dropdown" ref={dropdownRef}>
                        <button className="profile-button" onClick={() => setDropdownOpen((prev) => !prev)}>{name}</button>
                        {isDropdownOpen && (
                            <ul className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
                                {role === 'admin' && (
                                    <li>
                                        <Link to="/Dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                    <button className="signout" onClick={() => { setRole("guest"); setName(""); setEmail(""); }}>
                    Sign Out
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
