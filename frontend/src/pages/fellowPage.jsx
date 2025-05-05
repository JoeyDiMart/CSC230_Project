import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./fellowPage.module.css";
import { ImCross } from "react-icons/im";

function FellowPage({ role }) {
    const defaultFellows = [
        {
            name: "John Doe",
            year: "2023",
            bio: "John is a researcher in AI and machine learning.",
            photo: "/images/Fellows/image3.jpeg",
            publicationLink: "https://example.com/john-publication",
            topic: "Artificial Intelligence",
            collaborators: "Dr. Smith",
            isMyFellowship: true
        },
        {
            name: "Jane Smith",
            year: "2022",
            bio: "Jane specializes in renewable energy research.",
            photo: "/images/Fellows/image1.jpeg",
            publicationLink: "https://example.com/jane-publication",
            topic: "Renewable Energy",
            collaborators: "Dr. Johnson",
            isMyFellowship: false
        },
        {
            name: "Alice Brown",
            year: "2021",
            bio: "Alice focuses on quantum computing advancements.",
            photo: "/images/Fellows/image6.jpeg",
            publicationLink: "https://example.com/alice-publication",
            topic: "Quantum Computing",
            collaborators: "Dr. Lee",
            isMyFellowship: true
        }
    ];

    const [fellows, setFellows] = useState(defaultFellows);
    const [searchQuery, setSearchQuery] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [newFellow, setNewFellow] = useState({
        name: '',
        year: '',
        bio: '',
        photo: null,
        publicationLink: '',
        topic: '',
        collaborators: '',
        isMyFellowship: false
    });

    useEffect(() => {
        fetch("http://localhost:8081/fellows", {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setFellows(prev => [...prev, ...data]))
            .catch(err => console.error("Error loading fellows:", err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFellow(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewFellow(prev => ({ ...prev, photo: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(newFellow).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const res = await fetch("http://localhost:8081/fellows/upload", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (res.ok) {
                alert("Fellow added successfully");
                const updated = await res.json();
                setFellows(prev => [...prev, updated]);
                setShowUpload(false);
            } else {
                const err = await res.json();
                alert("Upload failed: " + err.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong.");
        }
    };

    const filteredFellows = fellows.filter(fellow =>
        fellow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fellow.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const myFellowships = filteredFellows.filter(fellow => fellow.isMyFellowship);
    const otherFellowships = filteredFellows.filter(fellow => !fellow.isMyFellowship);

    return (
        <div className="fellow-page">
            <h1 className="text-center">Our Research Fellows</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search fellows by name or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        width: "100%",
                        maxWidth: "400px",
                        marginBottom: "20px"
                    }}
                />
            </div>

            {role === "admin" && (
                <button
                    className="upload-btn"
                    onClick={() => setShowUpload(true)}
                    style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginBottom: "20px"
                    }}
                >
                    Upload New Fellow
                </button>
            )}

            {showUpload && (
                <>
                    <div className="popup-backdrop" onClick={() => setShowUpload(false)}></div>
                    <div className="upload-popup">
                        <button className="exit-upload" onClick={() => setShowUpload(false)}>
                            <ImCross />
                        </button>
                        <h2>Upload New Fellow</h2>
                        <form onSubmit={handleSubmit} className="input-container">
                            <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
                            <input type="text" name="year" placeholder="Fellowship Year" onChange={handleInputChange} required />
                            <textarea name="bio" placeholder="Short Bio" onChange={handleInputChange} required />
                            <input type="url" name="publicationLink" placeholder="Publication URL" onChange={handleInputChange} />
                            <input type="text" name="topic" placeholder="Fellowship Topic" onChange={handleInputChange} />
                            <input type="text" name="collaborators" placeholder="CIRT Faculty Collaborators" onChange={handleInputChange} />
                            <label>
                                <input
                                    type="checkbox"
                                    name="isMyFellowship"
                                    onChange={(e) => setNewFellow(prev => ({ ...prev, isMyFellowship: e.target.checked }))}
                                />
                                My Fellowship
                            </label>
                            <input type="file" accept="image/*" onChange={handleFileChange} required />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </>
            )}

            <h2>My Fellowships</h2>
            <div className="fellow-grid">
                {myFellowships.map((fellow, idx) => (
                    <div className="fellow-card" key={idx}>
                        <img src={fellow.photo} alt={fellow.name} />
                        <h3>{fellow.name} ({fellow.year})</h3>
                        <p>{fellow.bio}</p>
                        <p><strong>Topic:</strong> {fellow.topic}</p>
                        <p><strong>Collaborators:</strong> {fellow.collaborators}</p>
                        {fellow.publicationLink && (
                            <a href={fellow.publicationLink} target="_blank" rel="noopener noreferrer">
                                View Publication
                            </a>
                        )}
                    </div>
                ))}
            </div>

            <h2>Other Fellowships</h2>
            <div className="fellow-grid">
                {otherFellowships.map((fellow, idx) => (
                    <div className="fellow-card" key={idx}>
                        <img src={fellow.photo} alt={fellow.name} />
                        <h3>{fellow.name} ({fellow.year})</h3>
                        <p>{fellow.bio}</p>
                        <p><strong>Topic:</strong> {fellow.topic}</p>
                        <p><strong>Collaborators:</strong> {fellow.collaborators}</p>
                        {fellow.publicationLink && (
                            <a href={fellow.publicationLink} target="_blank" rel="noopener noreferrer">
                                View Publication
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

FellowPage.propTypes = {
    role: PropTypes.string.isRequired
};

export default FellowPage;