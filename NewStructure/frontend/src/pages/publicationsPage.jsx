import React, {useState} from "react";
import Navbar from "../components/navbar.jsx";
import "./publicationsPage.css"

function Publications({ role, email, name }) {
    role = "publisher"
    const [showUpload, setShowUpload] = useState(false);
    //const [filteredPublications, setFilteredPublications] = useState(publications);

    function searchText() {
        const searchInput = ""
        const filter = ""
        /*
        if (filter === "title") {
        }
        else if (filter === "author") {
        }
        else if (filter === "keyword") {
        }
         */
        setFilteredPublications(filteredPublications);
    }

    return (
        <>
            {role === "publisher" && (
                <div className="publisher-stuff">
                    <h2>My Publications</h2>
                    <button onClick={() => setShowUpload(true)}> Upload </button>
                    {showUpload && (
                        <div className="popup-overlay">
                            <div className="upload-popup">
                                <button onClick={() => setShowUpload(false)}>X</button>
                                <h3>Test</h3>
                            </div>
                        </div>
                    )}
                    <h2>Under Review</h2>
                </div>
            )}

            <h2>Publications</h2>
            <div className="search-bar">
                <input type="text" id="search" class="search-bar" onkeyup="searchText()" placeholder="Search..."/>
                <select id="filter" className="filter-menu" onChange="searchText()">
                    <option value="title">by Title</option>
                    <option value="author">by Author</option>
                    <option value="keyword">by Keyword</option>
                </select>
            </div>

        </>
    );
}

export default Publications;
