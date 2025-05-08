import { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import "./publicationsPage.css"; // Reuse the CSS from publicationsPage
import API_BASE_URL from "../config.js";
import "./fellowPage.css"; // Add your own CSS for the FellowPage

function FellowPage({role, email, name }) {
    const [fellows, setFellows] = useState([]);
    const [myFellows, setMyFellows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFilter, setSearchFilter] = useState("name");
    const [showUpload, setShowUpload] = useState(false);
    const [selectedFellow, setSelectedFellow] = useState(null); // Track selected fellowship
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
            .then((data) => {
                if (data && data.length > 0) { // Check if fellows exist
                    console.log("Fetched fellows:", data); // Debugging
                    setFellows(data);
                } else {
                    console.log("No fellows found in the database.");
                    setFellows([]); // Clear fellows if none exist
                }
            })
            .catch((err) => console.error("Error loading fellows:", err));
    }, []);
    // Fetch my fellowships
    useEffect(() => {
        if (email) { // Only fetch "my fellowships" if the user is logged in
            fetch(`${API_BASE_URL}/api/fellows?userId=${email}`, { credentials: "include" })
                .then((res) => res.json())
                .then((data) => setMyFellows(data))
                .catch((err) => console.error("Error loading my fellows:", err));
        } else {
            setMyFellows([]); // Clear "my fellowships" if not logged in
        }
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
        formData.append("isMyFellowship", email ? "true" : "false");
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
    console.log("filteredFellows", filteredFellows); // Debugging

    const openPreview = (fellow) => {
        setSelectedFellow(fellow);
    };

    const closePreview = () => {
        setSelectedFellow(null);
    };

    return (

        <div className="publisher-stuff">

            {email && (
                <div className="search-bar-container flex items-center justify-between flex-wrap gap-4 mb-6">
                    <h2>My Fellowships</h2>
                    <div className="animated-search-form text-black">
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
            )}

            {email && (
                <div className="pubs-scroll-wrapper">
                    {myFellows.map((fellow, idx) => (
                        <div
                            key={idx}
                            className="publication-container"
                            onClick={() => openPreview(fellow)}
                        >
                            <img
                                src={fellow.photo.startsWith("http") ? fellow.photo : `${API_BASE_URL}${fellow.photo}`}
                                alt={fellow.name}
                                className="publication-thumbnail"
                            />
                            <div className="publication-info-wrapper">
                                <h3>{fellow.topic}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {email && (
                <div className="pub-header" style={{ position: "absolute", top: "100px", right: "10px" }}>
                    <button onClick={() => setShowUpload(true)} className="upload">
                        Upload New Fellow
                    </button>
                </div>
            )}

            {showUpload && (
                <>
                    <div className="popup-backdrop" onClick={() => setShowUpload(false)}></div>
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="upload-popup">
                            <button
                                onClick={() => setShowUpload(false)}
                                className="exit-upload"
                            >
                                <ImCross size={12} />
                            </button>
                            <h2>Upload a Fellow</h2>
                            <div className="input-container">
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        onChange={handleInputChange}
                                        maxLength="20"
                                        required
                                    />
                                </label>
                                <label>
                                    Fellowship Year:
                                    <input
                                        type="text"
                                        name="year"
                                        placeholder="Fellowship Year"
                                        onChange={handleInputChange}
                                        pattern="\d{4}"
                                        title="Please enter a valid 4-digit year"
                                        required
                                    />
                                </label>
                                <label>
                                    Short Bio:
                                    <textarea
                                        name="bio"
                                        placeholder="Short Bio"
                                        onChange={handleInputChange}
                                        maxLength="100"
                                        required
                                    />
                                </label>
                                <label>
                                    Publication URL:
                                    <input
                                        type="url"
                                        name="publicationLink"
                                        placeholder="Publication URL"
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Fellowship Topic:
                                    <input
                                        type="text"
                                        name="topic"
                                        placeholder="Fellowship Topic"
                                        onChange={handleInputChange}
                                        maxLength="100"
                                    />
                                </label>
                                <label>
                                    Collaborators:
                                    <input
                                        type="text"
                                        name="collaborators"
                                        placeholder="Collaborators"
                                        onChange={handleInputChange}
                                        maxLength="50"
                                    />
                                </label>
                                <label>
                                    Add Photo:
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </label>
                                <button type="submit" className="submit-upload">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )}

            <div className="search-bar-container flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2>All Fellowships</h2>
                <div className="animated-search-form flex items-center gap-2">
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
                    <div
                        key={idx}
                        className="publication-container"
                        onClick={() => openPreview(fellow)}
                    >
                        <img
                            src={`${API_BASE_URL}${fellow.photo}`}
                            alt={fellow.name}
                            className="publication-thumbnail"
                        />
                        <div className="publication-info-wrapper">
                            <h3>{fellow.topic}</h3>
                        </div>
                    </div>
                ))}
            </div>
            {selectedFellow && (
                <>
                    <div className="popup-backdrop" onClick={closePreview}></div>
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button className="popup-close" onClick={closePreview}>
                                <ImCross size={20} />
                            </button>
                            <h2>{selectedFellow.name}</h2>
                            <p><strong>Year:</strong> {selectedFellow.year}</p>
                            <p><strong>Bio:</strong> {selectedFellow.bio}</p>
                            <p><strong>Publication Link:</strong> <a href={selectedFellow.publicationLink} target="_blank" rel="noopener noreferrer">{selectedFellow.publicationLink}</a></p>
                            <p><strong>Topic:</strong> {selectedFellow.topic}</p>
                            <p><strong>Collaborators:</strong> {selectedFellow.collaborators}</p>
                            <img
                                src={`${API_BASE_URL}${selectedFellow.photo}`}
                                alt={selectedFellow.name}
                                className="publication-thumbnail"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default FellowPage;