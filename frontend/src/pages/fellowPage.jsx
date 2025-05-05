import React, { useState } from "react";
import styles from "./fellowPage.module.css";

const initialFellowsData = [
    {
        id: 1,
        name: "John Doe",
        year: "2023",
        bio: "John worked on AI research with Dr. Smith.",
        fellowshipTopic: "Artificial Intelligence in Healthcare",
        faculty: "Dr. Smith",
        image: "https://via.placeholder.com/200",
        publishedLink: "https://example.com/publication1",
    },
    {
        id: 2,
        name: "Jane Smith",
        year: "2022",
        bio: "Jane focused on renewable energy solutions.",
        fellowshipTopic: "Sustainable Energy Systems",
        faculty: "Dr. Johnson",
        image: "https://via.placeholder.com/200",
        publishedLink: "https://example.com/publication2",
    },
];

function FellowPage({ role }) {
    const [fellowsData, setFellowsData] = useState(initialFellowsData);
    const [expandedFellow, setExpandedFellow] = useState(null);
    const [newFellow, setNewFellow] = useState({
        name: "",
        year: "",
        bio: "",
        fellowshipTopic: "",
        faculty: "",
        image: "",
        publishedLink: "",
    });

    const handleExpand = (fellow) => {
        setExpandedFellow(fellow);
    };

    const handleClose = () => {
        setExpandedFellow(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFellow((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFellow = (e) => {
        e.preventDefault();
        const newFellowData = { ...newFellow, id: fellowsData.length + 1 };
        setFellowsData((prev) => [...prev, newFellowData]);
        setNewFellow({
            name: "",
            year: "",
            bio: "",
            fellowshipTopic: "",
            faculty: "",
            image: "",
            publishedLink: "",
        });
    };

    return (
        <div className={styles.fellowPage}>
            <h1 className={styles.pageTitle}>Fellows</h1>
            {role === "admin" && (
                <form className={styles.adminForm} onSubmit={handleAddFellow}>
                    <h2>Add New Fellow</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newFellow.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="year"
                        placeholder="Year"
                        value={newFellow.year}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={newFellow.bio}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="fellowshipTopic"
                        placeholder="Fellowship Topic"
                        value={newFellow.fellowshipTopic}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="faculty"
                        placeholder="Faculty"
                        value={newFellow.faculty}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="url"
                        name="image"
                        placeholder="Image URL"
                        value={newFellow.image}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="url"
                        name="publishedLink"
                        placeholder="Published Work Link"
                        value={newFellow.publishedLink}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Fellow</button>
                </form>
            )}
            <div className={styles.fellowGrid}>
                {fellowsData.map((fellow) => (
                    <div
                        key={fellow.id}
                        className={styles.fellowCard}
                        onClick={() => handleExpand(fellow)}
                    >
                        <button className={styles.fellowButton}>
                            <img
                                src={fellow.image}
                                alt={fellow.name}
                                className={styles.fellowImage}
                            />
                            <div className={styles.fellowInfo}>
                                <h2 className={styles.fellowName}>{fellow.name}</h2>
                                <p className={styles.fellowYear}>{fellow.year}</p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {expandedFellow && (
                <div className={`${styles.expandedContentContainer} ${styles.open}`}>
                    <div className={styles.expandedContent}>
                        <button
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                        <img
                            src={expandedFellow.image}
                            alt={expandedFellow.name}
                            className={styles.expandedImage}
                        />
                        <div className={styles.expandedDetails}>
                            <h2 className={styles.fellowName}>
                                {expandedFellow.name} ({expandedFellow.year})
                            </h2>
                            <p className={styles.fellowBio}>{expandedFellow.bio}</p>
                            <p>
                                <strong>Fellowship Topic:</strong>{" "}
                                {expandedFellow.fellowshipTopic}
                            </p>
                            <p>
                                <strong>Faculty:</strong> {expandedFellow.faculty}
                            </p>
                            <a
                                href={expandedFellow.publishedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.publishedLink}
                            >
                                View Published Work
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FellowPage;