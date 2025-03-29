import React from "react";
import Navbar from "../components/navbar.jsx";
import "./publicationsPage.css"


function Publications(role, email, name) {
    //role = "publisher"

    return (
        <>
            {role === "publisher" && (
                <div className="publisher-stuff">
                <h2>My Publications</h2>
                <h2>Under Review</h2>
                </div>
                )}

            <h2>Publications</h2>
        </>



    )
}

export default Publications;
