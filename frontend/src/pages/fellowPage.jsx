import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import "./publicationsPage.css"; // Reuse the CSS from publicationsPage
import API_BASE_URL from "../config.js";

function FellowPage({role, email, name }) {
    const [fellows, setFellows] = useState([]);
    const [myFellows, setMyFellows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFilter, setSearchFilter] = useState("name");
    const [showUpload, setShowUpload] = useState(false);
    const [newFellow, setNewFellow] = useState({
        name: "",
        year: "",
        bio: "",
        photo: null,
        publicationLink: "",
        topic: "",
        collaborators: "",
        isMyFellowship: false,
    });



    useEffect(() => {
        fetch(`${API_BASE_URL}/api/fellows`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setFellows(data))
            .catch((err) => console.error("Error loading fellows:", err));
    }, []);

    // Fetch my fellowships
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/fellows?userId=${email}`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setMyFellows(data))
            .catch((err) => console.error("Error loading my fellows:", err));
    }, [email]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFellow((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewFellow((prev) => ({ ...prev, photo: e.target.files[0] }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", newFellow.name);
        formData.append("year", newFellow.year);
        formData.append("bio", newFellow.bio);
        formData.append("publicationLink", newFellow.publicationLink);
        formData.append("topic", newFellow.topic);
        formData.append("collaborators", newFellow.collaborators);
        formData.append("isMyFellowship", newFellow.isMyFellowship ? "true" : "false");
        formData.append("photo", newFellow.photo);

        console.log("FormData:", formData);
        console.log("New fellow photo file:", newFellow.photo);

        try {
            const res = await fetch(`${API_BASE_URL}/api/fellow/upload`, {
                method: "POST",
                credentials: "include",
                body: formData, // ✅ Do not set Content-Type manually
            });

            if (res.ok) {
                const updated = await res.json();
                setFellows((prev) => [...prev, updated]);
                setShowUpload(false);
                alert("Fellow added successfully");
            } else {
                const err = await res.json();
                alert("Upload failed: " + err.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong.");
        }
    };

    const filteredFellows = fellows.filter((fellow) =>
        fellow[searchFilter] && fellow[searchFilter].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="publisher-stuff">
            <div className="pub-header">
                <h2>My Fellowships</h2>
                <button onClick={() => setShowUpload(true)} className="upload">
                    Upload New Fellow
                </button>
            </div>

            {showUpload && (
                <>
                    <div className="popup-backdrop" onClick={() => setShowUpload(false)}></div>
                    <form onSubmit={handleSubmit}>
                        <div className="upload-popup">
                            <button
                                onClick={() => setShowUpload(false)}
                                className="exit-upload"
                            >
                                <ImCross size={12} />
                            </button>
                            <h2>Upload a Fellow</h2>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="year"
                                    placeholder="Fellowship Year"
                                    onChange={handleInputChange}
                                    required
                                />
                                <textarea
                                    name="bio"
                                    placeholder="Short Bio"
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="url"
                                    name="publicationLink"
                                    placeholder="Publication URL"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="topic"
                                    placeholder="Fellowship Topic"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="collaborators"
                                    placeholder="Collaborators"
                                    onChange={handleInputChange}
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isMyFellowship"
                                        onChange={(e) =>
                                            setNewFellow((prev) => ({
                                                ...prev,
                                                isMyFellowship: e.target.checked,
                                            }))
                                        }
                                    />
                                    My Fellowship
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                <button type="submit" className="submit-upload">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )}

            <div className="search-bar-container">
                <div className="animated-search-form">
                    <button className="search-icon">
                        <FaSearch size={14} />
                    </button>
                    <input
                        type="text"
                        className="animated-search-input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="select-wrapper">
                        <div className="select-inner">
                            <select
                                className="search-filter"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                            >
                                <option value="name">Name</option>
                                <option value="topic">Topic</option>
                                <option value="year">Year</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pubs-scroll-wrapper">
                {filteredFellows.map((fellow, idx) => (
                    <div key={idx} className="publication-container">
                        <img
                            src={`${API_BASE_URL}${fellow.photo}`} // Prepend the base URL to the photo path
                            alt={fellow.name}
                            className="publication-thumbnail"
                        />
                        <div className="publication-info-wrapper">
                            <h3>
                                {fellow.name} ({fellow.year})
                            </h3>
                            <p>{fellow.bio}</p>
                            <p>
                                <strong>Topic:</strong> {fellow.topic}
                            </p>
                            <p>
                                <strong>Collaborators:</strong> {fellow.collaborators}
                            </p>
                            {fellow.publicationLink && (
                                <a
                                    href={fellow.publicationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Publication
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <h2>All Fellowships</h2>
            <div className="search-bar-container">
                <div className="animated-search-form">
                    <button className="search-icon">
                        <FaSearch size={14} />
                    </button>
                    <input
                        type="text"
                        className="animated-search-input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="select-wrapper">
                        <div className="select-inner">
                            <select
                                className="search-filter"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                            >
                                <option value="name">Name</option>
                                <option value="topic">Topic</option>
                                <option value="year">Year</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pubs-scroll-wrapper">
                {filteredFellows.map((fellow, idx) => (
                    <div key={idx} className="publication-container">
                        <img
                            src={`${API_BASE_URL}${fellow.photo}`}
                            alt={fellow.name}
                            className="publication-thumbnail"
                        />
                        <div className="publication-info-wrapper">
                            <h3>
                                {fellow.name} ({fellow.year})
                            </h3>
                            <p>{fellow.bio}</p>
                            <p>
                                <strong>Topic:</strong> {fellow.topic}
                            </p>
                            <p>
                                <strong>Collaborators:</strong> {fellow.collaborators}
                            </p>
                            {fellow.publicationLink && (
                                <a
                                    href={fellow.publicationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Publication
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FellowPage;