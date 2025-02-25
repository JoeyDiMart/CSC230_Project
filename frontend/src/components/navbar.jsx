import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import "./navbar.css";

function Navbar() {  
    const [role, setRole] = useState("guest")
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    const navigate = useNavigate();

    //const [role, setRole] = useState("guest"); DELETE THIS PUT IT IN SOMEWHERE MORE GLOBAL LIKE APP.JSX

    return (
        <nav className="navbar">
            <div className="nav-items">

                <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times rotate' : 'fas fa-bars'}/>
                </div>

                {/* Conditional to activate the nav menu*/}
                <ul className={click? 'nav-menu active' : 'nav-menu'}>
                    <li><Link to="/Publications" onClick={closeMobileMenu}>Publications</Link></li>
                    <li><Link to="/Events" onClick={closeMobileMenu}>Events</Link></li>
                    <li><Link to="/About" onClick={closeMobileMenu}>About Us</Link></li>
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
                <button className="SignOut" onClick={() => setRole("guest")}></button>
            )}
            {/* Need to add Account Page for here */}
        </nav>
    );
}




export default Navbar;