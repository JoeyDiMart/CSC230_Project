import React, {useState, useEffect} from "react";
import { useDropzone } from 'react-dropzone';
import Navbar from "../components/navbar.jsx";
import "./publicationsPage.css"
import Pubs from './publications.jsx';

function Publications({ role, email, name }) {
    const [showUpload, setShowUpload] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [publications, setPublications] = useState([]);
    const [myPublications, setMyPublications] = useState([]);
    const [reviewPublications, setReviewPublications] = useState([]);
    const [popupPub, setPopupPub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popupType, setPopupType] = useState("");
    // search for text in that specific filter
    const [searchText, setSearchText] = useState("");
    const [searchFilter, setSearchFilter] = useState("title");

    // list for uploading a publication
    const [uploadFile, setUploadFile] =
        useState({
            title: '',
            author: [name],
            email: email,
            keywords: [],
            file: '',
            status: 'under review',
            comments: ''
        });

    // get publications from database (only accepted ones)
    useEffect(() => {
        fetch("http://localhost:8081/api/publications1")
            .then(response => response.json())  // Expecting an array of publications
            .then((data) => {
                const acceptedPublications = data.filter(pub => pub.status === "accepted");
                setPublications(acceptedPublications);
            })
            .catch((error) => {
                console.error("Error fetching publications:", error);
                setErrorMessage("Failed to load publications. Please try again later.");
            });
    }, []);

    const [emaiil, setEmail] = useState(localStorage.getItem("email"));
    const [rolle, setRole] = useState(localStorage.getItem("role"));
    
    useEffect(() => {
        if (email && role) {
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);
        }
    }, [email, role]);
    
    useEffect(() => {
        if (true) {
            fetchMyPublications();
        }
    }, [email, role]);
    
    const fetchMyPublications = () => {
        if (!email) {
            
            email = localStorage.getItem("email")
            
        }
    
        fetch(`http://localhost:8081/api/publications/byEmail/${email}`)
            .then((response) => response.json())
            .then((data) => {
                setMyPublications(data);
            })
            .catch((error) => {
                console.error("Error fetching user publications:", error);
            });
    };

    
    // get publications from database (all under review)
    useEffect(() => {
        if (role === "admin" || role === "reviewer") {
            fetchReviewPublications();
        }
    }, []);
    const fetchReviewPublications = () => {
        fetch("http://localhost:8081/api/publications3")
            .then(response => response.json())  // Expecting an array of publications
            .then((data) => {
                const underReview = data.filter(pub => pub.status === "under review");
                setReviewPublications(underReview);
            })
            .catch((error) => {
                console.error("Error fetching publications:", error);
                setErrorMessage("Failed to load publications. Please try again later.");
            });
    };



    // Handles typing in for uploading a new publication
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "keywords") {
            setUploadFile(prev => ({ ...prev, keywords: value.split(",").map(s => s.trim())}));
        } else if (name === "author") {
            setUploadFile(prev => ({ ...prev, author: value.split(",") }));
        } else {
            setUploadFile(prev => ({ ...prev, [name]: value }));
        }
    };

    // submission handler for uploading new publications
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");  // remove previous errors before sending new message

        if (!uploadFile.title || !uploadFile.author || !uploadFile.file) {
            alert("Please fill all fields.");
            return;
        }
        const formData = new FormData();
        formData.append("title", uploadFile.title);
        formData.append("author", JSON.stringify(uploadFile.author));
        formData.append("email", uploadFile.email);
        formData.append("keywords", JSON.stringify(uploadFile.keywords));
        formData.append("file", uploadFile.file);
        formData.append("status", uploadFile.status);
        formData.append("comments", JSON.stringify(uploadFile.comments));

        try {
            setShowUpload(false);  // delete this soon
            const res = await fetch("http://localhost:8081/api/publications", {
                method: "POST",
                body: formData
            });

            const data = await res.json();


            if (res.ok) {
                //setShowUpload(false); move it here after we get it from backend
                alert("Upload successful!");
                fetchMyPublications();
                if (role === "reviewer" || role === "admin") {
                    fetchReviewPublications();
                }

            } else {
                setErrorMessage(data.error || "Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setErrorMessage("Something went wrong while uploading.");
        }
    };



    // Handle drop event
    const onDrop = (acceptedFiles) => {
        console.log('Accepted files:', acceptedFiles);
        const file = acceptedFiles[0];
        setUploadFile(prev => ({ ...prev, file }));
    };

    // Setup react-dropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.pdf',
        multiple: false
    });
    // hit search button sends text and filter to backend
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/publications/search?${searchFilter}=${searchText}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Search failed.");
            }

            const accepted = data.filter(pub => pub.status === "accepted");
            setPublications(accepted);
        } catch (err) {
            setErrorMessage(err.message);
            console.error("Search failed:", err);
        }
    };

    // handle the popup for all general publications ( see preview and such )
    const handlePublicationPopup = (publication, type = "general") => {
        setPopupPub(publication);
        setPopupType(type); // "general" or "review"
    };
    const handleClosePopup = () => {
        setPopupPub(null);
    };


    return (
        <div className="publisher-stuff">
        {(role !== "guest") && (
                <div>
                    <h2>My Publications</h2>
                    <button onClick={() => setShowUpload(true)} className="upload"> Upload </button>
                    {showUpload && (
                        <form onSubmit={handleSubmit}>
                        <div className="upload-popup">
                            <button onClick={() => setShowUpload(false)} className="exit-upload">X</button>
                            <h2>Upload a Publication</h2>
                            <div className="input-container">
                                <input type="text" name="title" placeholder="Title" value={uploadFile.title} onChange={handleChange} required />
                                <div className="input-list">
                                    <input type="text" name="author" placeholder="Author(s)" value={uploadFile.author} onChange={handleChange} required />
                                    <input type="text" name="keywords" placeholder="Keywords" value={uploadFile.keywords} onChange={handleChange} />
                                </div>
                                <div {...getRootProps()} className="drop-container">
                                    <input {...getInputProps()} />
                                    <p>Drop files here, or click to select</p>
                                    {uploadFile && <p>File uploaded is {uploadFile.name} {uploadFile.title}</p>}
                                </div>
                                <button type="submit" className="submit-upload">Submit</button>
                            </div>
                        </div>
                        </form>
                    )}
                    <div className="pubs-scroll-wrapper">
                        <Pubs pubs={myPublications}
                              onPublicationClick={(pub) => handlePublicationPopup(pub, "general")}/>

                    </div>
                </div>
            )}
            {role === 'reviewer' && (
                <div className="reviewer-section">
                    <h2>Under Review</h2>
                    <div className="pubs-scroll-wrapper">
                        <Pubs pubs={reviewPublications} onPublicationClick={(pub) => handlePublicationPopup(pub, "reviewer")}/>
                    </div>
                </div>
            )}

            <h2>Publications</h2>
            <div className="search-bar-container">
                <form className="animated-search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <button type="submit" className="search-icon">
                        <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                                  stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        className="animated-search-input"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <div className="select-wrapper" style={{ position: "relative", display: "inline-block" }}>
                        <select className="search-filter" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}>
                            <option value="title">by Title</option>
                            <option value="author">by Author</option>
                            <option value="keyword">by Keyword</option>
                        </select>
                        <svg
                            className="dropdown-arrow"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"
                            stroke="#aaa"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
            </div>

        </form>

            </div>

            <div className="pubs-scroll-wrapper">
                <Pubs pubs={publications}
                      onPublicationClick={(pub) => handlePublicationPopup(pub, "general")}/>
            </div>

            {popupPub && (
                <div className="popup-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className={`pub-popup ${popupType === "review" ? "review-popup" : "general-popup"}`}>
                        <div className="popup-details">
                            <button onClick={handleClosePopup} className="exit-upload">X</button>
                            <div className="review-header">
                                <h2>{popupPub.title}</h2>
                                <p>Author(s): {popupPub.author?.join(", ")}</p>
                            </div>
                            <textarea
                                placeholder="Enter your review comments..."
                                className="review-textarea"
                            />
                            <div className="review-buttons">
                                <button className="accept">Accept</button>
                                <button className="reject">Reject</button>
                            </div>
                        </div>

                        <div className="popup-pdf">
                            <embed
                                src={`data:application/pdf;base64,${popupPub?.file?.data}`}
                                type="application/pdf"
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Publications;
