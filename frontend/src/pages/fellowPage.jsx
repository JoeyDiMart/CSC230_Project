import PropTypes from "prop-types"; // Import PropTypes for validation
import Navbar from "../components/navbar.jsx";
import styles from "./fellowPage.module.css";
import {useCallback, useEffect, useState} from "react";

const FellowPage = () => {
    const [activeFellow, setActiveFellow] = useState(null);
    const [fellows, setFellows] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFellows = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8081/api/fellows");
                if (!response.ok) {
                    throw new Error("Failed to fetch fellows");
                }
                const data = await response.json();
                setFellows(data);
            } catch (error) {
                console.error("Error fetching fellows:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFellows();
    }, []);

    const handleClickOutside = useCallback((event) => {
        const isClickInsidePopup = event.target.closest(`.${styles.expandedContentContainer}`);
        const isClickOutsidePopup = event.target.closest(`.${styles.fellowPage}`);

        if (!isClickInsidePopup && isClickOutsidePopup) {
            setActiveFellow(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <>
            <Navbar />
            <main className={styles.fellowPage}>
                <h1 className={styles.pageTitle}>Meet Our Fellows</h1>
                {loading ? (
                    <div className={styles.loadingContainer}>Loading fellows...</div>
                ) : (
                    <div className={styles.fellowGrid}>
                        {fellows.map((fellow) => (
                            <div key={fellow._id} className={styles.fellowCard}>
                                <button
                                    className={styles.fellowButton}
                                    onClick={() => setActiveFellow(fellow)}
                                >
                                    <img
                                        src={fellow.picture}
                                        alt={`${fellow.name}'s profile`}
                                        className={styles.fellowImage}
                                    />
                                    <div className={styles.fellowInfo}>
                                        <p className={styles.fellowName}>{fellow.name}</p>
                                        <p className={styles.fellowYear}>{fellow.year}</p>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {activeFellow && (
                    <ExpandedContent
                        fellow={activeFellow}
                        isOpen={!!activeFellow}
                        onClose={() => setActiveFellow(null)}
                    />
                )}
            </main>
        </>
    );
};

const ExpandedContent = ({ fellow, isOpen, onClose }) => {
    return (
        <div
            className={`${styles.expandedContentContainer} ${
                isOpen ? styles.open : ""
            }`}
            onClick={onClose}
        >
            <div className={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <img
                    src={fellow.picture}
                    alt={fellow.name}
                    className={styles.expandedImage}
                />
                <div className={styles.expandedDetails}>
                    <h2 className={styles.fellowName}>{fellow.name}</h2>
                    <p className={styles.fellowYear}>{fellow.year}</p>
                    <p className={styles.fellowBio}>{fellow.bio}</p>
                    {fellow.published && (
                        <a
                            href={fellow.published}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.publishedLink}
                        >
                            View Published Work
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

// Add PropTypes validation
ExpandedContent.propTypes = {
    fellow: PropTypes.shape({
        picture: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        published: PropTypes.string,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default FellowPage;