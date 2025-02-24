import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import "./navbar.css";

function Navbar() {
    const navigate = useNavigate();

    // "guest" is default
    const [role, setRole] = useState("guest");

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
            {role === "guest" && (
                <div className="auth-buttons">
                    <button className="Login" onClick={() => navigate("/Login")}>Log in</button>
                    <button className="signup" onClick={() => navigate("/Signup")}>Sign up</button>
                </div>
            )}

            {role !== "guest" && (
                <button className="SignOut" onClick={() => setRole("guest")}></button>
            {/* Need to add Account Page for here */}
            )}
        </nav>
    );
}

export default Navbar;