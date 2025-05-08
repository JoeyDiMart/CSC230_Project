import {useState, useEffect, useRef} from 'react';
import { useDropzone } from 'react-dropzone';
import "./publicationsPage.css"
import Pubs from './publications.jsx';
import { ImCross } from "react-icons/im";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config.js";


function Publications({ role, email, name }) {
    const [showUpload, setShowUpload] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [publications, setPublications] = useState([]);
    const [myPublications, setMyPublications] = useState([]);
    const [reviewPublications, setReviewPublications] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchFilter, setSearchFilter] = useState("title");
    const [popupPub, setPopupPub] = useState(null); // which publication to show
    const [showPopup, setShowPopup] = useState(false); // control if popup is open
    const [savingComment, setSavingComment] = useState(false);
    const [currentComment, setCurrentComment] = useState(""); // to control the textarea
    const typingTimeout = useRef(null);
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
        fetch(`${API_BASE_URL}/api/publications1`)
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



 // Only fetch my publications once on mount (not every render!)
useEffect(() => {
    fetchMyPublications();
}, []); // Empty dependency array = only runs once on mount

const fetchMyPublications = () => {
    const chocolate = localStorage.getItem("CurrentAccount");
    
    if (!chocolate) {
        console.warn("No cookie found for current account. Skipping fetch.");
        return; // Prevent fetch if no cookie is found
    }

    fetch(`${API_BASE_URL}/api/publications/byCookie/${chocolate}`)
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
    }, [role]);
    const fetchReviewPublications = () => {
        fetch(`${API_BASE_URL}/api/publications3`)
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

        if (!uploadFile.title || !uploadFile.file || uploadFile.author.length === 0) {
            alert("Please fill all fields.");
            return;
        }
        const formData = new FormData();
        const chocolate = localStorage.getItem("CurrentAccount");
    
        if (!chocolate) {
            console.warn("No cookie found for current account. Skipping fetch.");
            return; // Prevent fetch if no cookie is found
        }
        formData.append("title", uploadFile.title);
        formData.append("author", JSON.stringify(
            Array.isArray(uploadFile.author)
                ? uploadFile.author
                : uploadFile.author.split(",").map(s => s.trim())
        ));
        formData.append("email", chocolate);
        formData.append("keywords", JSON.stringify(
            Array.isArray(uploadFile.keywords)
                ? uploadFile.keywords
                : uploadFile.keywords.split(",").map(s => s.trim())
        ));
        formData.append("file", uploadFile.file);
        formData.append("status", uploadFile.status);

        try {
            setShowUpload(false);
            const res = await fetch(`${API_BASE_URL}/api/publications`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();


            if (res.ok) {
                //setShowUpload(false); move it here after we get it from backend
                alert("Upload successful!");
                fetchMyPublications(email || localStorage.getItem("email"));
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
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const {
        getRootProps: getReplaceRootProps,
        getInputProps: getReplaceInputProps,
    } = useDropzone({
        accept: {
            'application/pdf': ['.pdf']
        },
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
            const response = await fetch(`${API_BASE_URL}/api/publications/search?${searchFilter}=${searchText}`);
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
        setCurrentComment(publication.comments || ""); // <== add this
        setShowPopup(true);
    };

    const closePopup = () => {
        setPopupPub(null);
        setShowPopup(false);
    };


    // when publisher/reviewer/admin wants to upload a new file
    const handleFileReplace = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            alert("Please upload a valid PDF file.");
            return;
        }
        setReplacedFile(file);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/publications/${popupPub._id}/replace-file`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                alert("PDF and thumbnail replaced successfully!");

                // Refresh relevant publication lists
                fetchMyPublications();
                if (role === "admin" || role === "reviewer") {
                    fetchReviewPublications();
                }

                closePopup();
            } else {
                const errMsg = await res.json();
                alert(errMsg?.error || "Failed to replace PDF.");
            }
        } catch (err) {
            console.error("PDF replacement error:", err);
            alert("Error replacing file.");
        }
    };

    // change status when accepted/denied
    const handleStatusUpdate = async (newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/publications/${popupPub._id}/status`, {
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
        typingTimeout.current = setTimeout(async () => {
            setSavingComment(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/publications/${popupPub._id}/comments`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({comments: newComment}),
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
        }, 1500); // 👈 1500ms delay for a pause in typing thank you chatGPT

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
                                    {uploadFile.file && uploadFile.file.name && (
                                        <p>File uploaded is {uploadFile.file.name}</p>
                                    )}                                </div>
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
                    <div className="animated-search-form">
                        <button className="search-icon" onClick={handleSearch}>
                            <FaSearch className=" text-testingColorBlack" size={14}/>
                        </button>
                        <input
                            type="text"
                            className="animated-search-input"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="select-wrapper">
                            <div className="select-inner">
                                <select
                                    className="search-filter max-w-[200px] pr-8"
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                >
                                    <option value="title">Title</option>
                                    <option value="keyword">Keyword</option>
                                    <option value="author">Author</option>
                                </select>
                                <span className="dropdown-arrow flex items-center justify-center"><IoIosArrowDropdownCircle className="text-testingColorBlack" size={16}/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>



            <div className="pubs-scroll-wrapper">
                <Pubs pubs={publications} onPublicationClick={openPopup} showStatus={false}/>
            </div>

            {/*   The logic for popups    */}
            {showPopup && popupPub && (
                <>
                    <div className="pub-popup-backdrop" onClick={closePopup}></div>
                    <div className="pub-popup-overlay">
                        <div className="pub-popup-content" onClick={(e) => e.stopPropagation()}>
                            <button className="pub-popup-close" onClick={closePopup}>
                                <ImCross size={20} />
                            </button>

                            <div className="pub-popup-layout">
                                <div className="pub-popup-pdf">
                                    {popupPub?.file?.data ? (
                                        <embed
                                            src={`data:${popupPub?.file?.type || 'application/pdf'};base64,${popupPub?.file?.data}`}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                        />
                                    ) : (
                                        <p style={{ padding: "1rem", color: "red", fontWeight: "bold" }}>
                                            ⚠️ Preview unavailable – file data is missing.
                                        </p>
                                    )}
                                </div>
                                <div className="pub-popup-info">
                                    <h2>{popupPub.title}</h2>
                                    <p><strong>Authors:</strong>
                                        {Array.isArray(popupPub.author)
                                            ? popupPub.author.join(", ")
                                            : popupPub.author || "N/A"}
                                    </p>
                                    <p><strong>Keywords:</strong> {popupPub.keywords?.join(", ")}</p>

                                    {(role !== "guest" ) && (
                                        <>
                                        <div className="drop-container">
                                            <div {...getReplaceRootProps()} className="drop-container">
                                                <input {...getReplaceInputProps()} />
                                                <p>Drop new PDF here, or click to select</p>
                                                {replacedFile && <p>File: {replacedFile.name}</p>}
                                            </div>
                                        </div>
                                            {(role === "admin" || role === "reviewer") && (
                                                <>
                                                    <div className="pub-popup-comments">
                                                        <textarea placeholder="Write your comments here..."
                                                                  value={currentComment}
                                                                  onChange={(e) => handleCommentChange(e.target.value)} />
                                                    </div>
                                                    <div className="saving-text">
                                                        {savingComment && <p style={{ fontSize: "0.9rem", color: "#C8102E" }}>Saving...</p>}
                                                    </div>
                                                    {role === "reviewer" && (
                                                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                                                        <button onClick={() => handleStatusUpdate("accepted")} className="approve-btn">Approve</button>
                                                        <button onClick={() => handleStatusUpdate("denied")} className="deny-btn">Deny</button>
                                                    </div>
                                                    )}
                                                </>)}
                                            {(popupPub?.author?.includes(name)) && (
                                                <>
                                                    <div className="popup-comments">
                                                        <p><strong>Comments:</strong> {popupPub?.comments || "No comments yet."}</p>
                                                    </div>
                                                </>
                                            )}
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
