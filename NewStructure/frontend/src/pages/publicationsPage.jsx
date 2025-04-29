import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import "./publicationsPage.css"
import Pubs from './publications.jsx';
import { ImCross } from "react-icons/im";

function Publications({ role, email, name }) {
    const [showUpload, setShowUpload] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [publications, setPublications] = useState([]);
    const [myPublications, setMyPublications] = useState([]);
    const [reviewPublications, setReviewPublications] = useState([]);
    // search for text in that specific filter
    const [searchText, setSearchText] = useState("");
    const [searchFilter, setSearchFilter] = useState("title");
    const [popupPub, setPopupPub] = useState(null); // which publication to show
    const [showPopup, setShowPopup] = useState(false); // control if popup is open
    const [savingComment, setSavingComment] = useState(false);
    const [currentComment, setCurrentComment] = useState(""); // to control the textarea
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [replacedFile, setReplacedFile] = useState(null);

    // list for uploading a publication
    const [uploadFile, setUploadFile] =
        useState({
            title: '',
            author: name,
            email: email,
            keywords: '',
            file: '',
            status: 'under review',
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

    //const [emaiil, setEmail] = useState(localStorage.getItem("email"));
    //const [rolle, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        if (email && role) {
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);
        }
    }, [email, role]);

    useEffect(() => {
        let currentEmail = email;

        if (!currentEmail) {
            currentEmail = localStorage.getItem("email");
        }

        if (currentEmail) {
            fetchMyPublications(currentEmail);
        } else {
            console.warn("⚠️ No email found to fetch publications.");
        }
    }, [email, role]);
    
    const fetchMyPublications = (email) => {
        if (!email) {
            
            email = localStorage.getItem("email")
            
        }
    
        fetch(`http://localhost:8081/api/publications/byEmail/${email}`)
            .then((response) => response.json())
            .then((data) => {
                setMyPublications(data);
                console.log(data);
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
    }, [role]);
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
        setUploadFile(prev => ({
            ...prev,
            [name]: value
        }));
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
        formData.append("author", JSON.stringify(uploadFile.author.split(",").map(s => s.trim())));
        formData.append("email", uploadFile.email);
        formData.append("keywords", JSON.stringify(uploadFile.keywords.split(",").map(s => s.trim())));
        formData.append("file", uploadFile.file);
        formData.append("status", uploadFile.status);

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


    // handle drag and drop
    const onDrop = (acceptedFiles) => {
        if (!acceptedFiles.length) {
            alert("No file selected.");
            return;
        }

        const file = acceptedFiles[0];

        if (file && file.type === 'application/pdf') {
            setUploadFile(prev => ({
                ...prev,
                file: file
            }));

            console.log("📄 File selected:", file.name);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };


    // Setup react-dropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.pdf',
        multiple: false
    });

    const {
        getRootProps: getReplaceRootProps,
        getInputProps: getReplaceInputProps,
    } = useDropzone({
        accept: '.pdf',
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                handleFileReplace(acceptedFiles[0]);
            }
        }
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

    // helper functions for the popup logic to open and close
    const openPopup = (publication) => {
        setPopupPub(publication);
        setShowPopup(true);
    };

    const closePopup = () => {
        setPopupPub(null);
        setShowPopup(false);
    };


    // when reviewer/admin wants to upload a new file
    const handleFileReplace = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            alert("Please upload a valid PDF file.");
            return;
        }
        setReplacedFile(file);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`http://localhost:8081/api/publications/${popupPub._id}/replace-file`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                alert("PDF replaced successfully!");
                closePopup();
            } else {
                alert("Failed to replace PDF.");
            }
        } catch (err) {
            console.error("PDF replacement error:", err);
            alert("Error replacing file.");
        }
    };

    // change status when accepted/denied
    const handleStatusUpdate = async (newStatus) => {
        try {
            const res = await fetch(`http://localhost:8081/api/publications/${popupPub._id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert(`Publication ${newStatus}`);
                closePopup();
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error("Status update error:", err);
        }
    };

    // comment logic
    const handleCommentChange = (newComment) => {
        setCurrentComment(newComment);

        // Clear the previous timer if still waiting
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timer
        const timeoutId = setTimeout(async () => {
            setSavingComment(true);

            try {
                const res = await fetch(`http://localhost:8081/api/publications/${popupPub._id}/comments`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ comments: newComment }),
                });

                if (res.ok) {
                    console.log("Comment saved.");
                } else {
                    console.warn("Failed to save comment.");
                }
            } catch (err) {
                console.error("Error saving comment:", err);
            } finally {
                setSavingComment(false);
            }
        }, 500); // 👈 500ms delay for a pause in typing thank you chatGPT

        setTypingTimeout(timeoutId); // Save the timeout ID
    };


    return (
        <div className="publisher-stuff">
        {(role !== "guest") && (
                <div>
                    <div className="pub-header">
                        <h2>My Publications</h2>
                        <button onClick={() => setShowUpload(true)} className="upload"> Upload </button>
                    </div>
                    {showUpload && (
                        <>
                        <div className="popup-backdrop" onClick={() => setShowUpload(false)}></div>
                        <form onSubmit={handleSubmit}>
                        <div className="upload-popup">
                            <button onClick={() => setShowUpload(false)} className="exit-upload"><ImCross size={12} />
                            </button>
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
                                    {uploadFile && <p>File uploaded is {uploadFile.file.name} </p>}
                                </div>
                                <button type="submit" className="submit-upload">Submit</button>
                            </div>
                        </div>
                        </form>
                        </>
                    )}
                    <div className="pubs-scroll-wrapper">
                        <Pubs pubs={myPublications} onPublicationClick={openPopup} showStatus={true} />

                    </div>
                </div>
            )}
            {role === 'reviewer' && (
                <div className="reviewer-section">
                    <h2>Under Review</h2>
                    <div className="pubs-scroll-wrapper">
                        <Pubs pubs={reviewPublications} onPublicationClick={openPopup} showStatus={true} />
                    </div>
                </div>
            )}

            <h1>Publications</h1>
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
                <Pubs pubs={publications} onPublicationClick={openPopup} showStatus={false}/>
            </div>

            {/*   The logic for popups    */}
            {showPopup && popupPub && (
                <>
                    <div className="popup-backdrop" onClick={closePopup}></div>
                    <div className="popup-overlay">
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <button className="popup-close" onClick={closePopup}>
                                <ImCross size={20} />
                            </button>

                            <div className="popup-layout">
                                <div className="popup-pdf">
                                    <embed
                                        src={`data:application/pdf;base64,${popupPub?.file?.data}`}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                                <div className="popup-info">
                                    <h2>{popupPub.title}</h2>
                                    <p><strong>Authors:</strong> {popupPub.author?.join(", ")}</p>
                                    <p><strong>Keywords:</strong> {popupPub.keywords?.join(", ")}</p>

                                    {(role === "reviewer" || role === "admin") && (
                                        <>
                                        <div className="drop-container">
                                            <div {...getReplaceRootProps()} className="drop-container">
                                                <input {...getReplaceInputProps()} />
                                                <p>Drop new PDF here, or click to select</p>
                                                {replacedFile && <p>File: {replacedFile.name}</p>}
                                            </div>
                                        </div>
                                        <div className="popup-comments">
                                            {savingComment && <p style={{ fontSize: "0.9rem", color: "#C8102E" }}>Saving...</p>}
                                            <textarea placeholder="Write your comments here..."
                                                      value={popupPub.comments || ""}
                                                      onChange={(e) => handleCommentChange(e.target.value)}
                                            />

                                        </div>
                                        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleStatusUpdate("accepted")} className="approve-btn">Approve</button>
                                            <button onClick={() => handleStatusUpdate("denied")} className="deny-btn">Deny</button>
                                        </div>
                                        </>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
            );
        }

export default Publications;
