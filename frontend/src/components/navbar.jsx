import React from "react";

function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/publicationsPage">Publications</a></li>
                <li><a href="/eventsPage">Events</a></li>
                <li><a href="/aboutPage">About Us</a></li>
                <li><a href="/researchPage">Research Associates</a></li>
                <li><a href="/signupPage">Sign Up</a></li>
                <li><a href="/loginPage">Log In</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
