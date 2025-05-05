import React, {useState, useEffect} from "react";
import { useDropzone } from 'react-dropzone';
import "./postersPage.css"
import Posters from './posters.jsx';
import { ImCross } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";



function PostersPage({ role, email, name }) {
    const [showUpload, setShowUpload] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [posters, setPosters] = useState([]);
    const [myPosters, setMyPosters] = useState([]);
    const [pendingPosters, setPendingPosters] = useState([]);
    const [popupPoster, setPopupPoster] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMyPosters, setLoadingMyPosters] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchFilter, setSearchFilter] = useState("title");

    // State for uploading a poster
    const [uploadFile, setUploadFile] = useState({
        title: '',
        author: name,
        email: email,
        keywords: [],
        file: '',
        status: 'pending',
        description: ''
    });

    // Get approved posters
    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8081/posters", {
            credentials: 'include'
        })
            .then(response => response.json())
            .then((data) => {
                const approvedPosters = data.filter(poster => poster.status === "approved");
                setPosters(approvedPosters);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching approved posters:", error);
                setLoading(false);
                setLoadingError(true);
            });
    }, []);

    // Get user's posters
    useEffect(() => {
        if (email) {
            setLoadingMyPosters(true);
            fetchMyPosters(email);
        }
    }, [email]);

    const fetchMyPosters = async (emailParam) => {
        try {
            const response = await fetch(`http://localhost:8081/posters/user/${emailParam}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                setMyPosters(data);
                setErrorMessage("");
            } else {
                console.error("Received non-array data:", data);
                setErrorMessage("Invalid data received from server");
            }
            setLoadingMyPosters(false);
        } catch (error) {
            console.error("Error fetching user posters:", error);
            setErrorMessage("Failed to load your posters. Please try again later.");
            setLoadingMyPosters(false);
        }
    };

    // Get pending posters for admin/reviewer
    useEffect(() => {
        if (role === "admin") {
            fetchPendingPosters();
        }
    }, [role]);

    const fetchPendingPosters = () => {
        fetch("http://localhost:8081/posters/pending", {
            credentials: 'include'
        })
            .then(response => response.json())
            .then((data) => {
                setPendingPosters(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching pending posters:", error);
                setLoading(false);
                setLoadingError(true);
            });
    };

    // Handle input changes for uploading
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "keywords") {
            setUploadFile(prev => ({ ...prev, keywords: value.split(",").map(s => s.trim())}));
        } else {
            setUploadFile(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle poster submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!uploadFile.title || !uploadFile.file) {
            alert("Please fill all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("title", uploadFile.title);
        formData.append("author", uploadFile.author);
        formData.append("email", uploadFile.email);
        formData.append("keywords", JSON.stringify(uploadFile.keywords));
        formData.append("file", uploadFile.file);
        formData.append("status", uploadFile.status);
        formData.append("description", uploadFile.description);

        try {
            setShowUpload(false);
            const res = await fetch("http://localhost:8081/posters/upload", {
                method: "POST",
                body: formData,
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                alert("Upload successful!");
                fetchMyPosters();
                if (role === "admin") {
                    fetchPendingPosters();
                }
            } else {
                setErrorMessage(data.error || "Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setErrorMessage("Something went wrong while uploading.");
        }
    };

    // Handle file drop
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadFile(prev => ({ ...prev, file }));
    };

    // Setup dropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    // Handle search
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8081/posters/search?${searchFilter}=${searchText}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Search failed.");
            }

            const approved = data.filter(poster => poster.status === "approved");
            setPosters(approved);
        } catch (err) {
            setErrorMessage(err.message);
            console.error("Search failed:", err);
        }
    };

    // Handle poster popup
    const handlePosterPopup = (poster, type = "general") => {
        setPopupPoster(poster);
        setPopupType(type);
    };

    const handleClosePopup = () => {
        setPopupPoster(null);
    };

    // Handle poster approval (admin only)
    const handleApprovePoster = async (posterId) => {
        try {
            const response = await fetch(`http://localhost:8081/posters/${posterId}/approve`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (response.ok) {
                alert("Poster approved successfully!");
                fetchPendingPosters();
                handleClosePopup();
            } else {
                const data = await response.json();
                throw new Error(data.message || "Failed to approve poster");
            }
        } catch (err) {
            console.error("Error approving poster:", err);
            setErrorMessage(err.message);
        }
    };

    return (
        <div>
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading posters...</p>
                </div>
            ) : loadingError ? (
                <div className="error-container">
                    <p>Failed to load posters. Please refresh the page.</p>
                    <button onClick={() => window.location.reload()}>Refresh</button>
                </div>
            ) : (
                <div>
                    <div className="posters-wrapper">
                        {/* Search Bar */}
                        <div className="flex flex-col w-full items-center justify-center pt-0 text-center">
                            <h1 className=" text-black">Explore Approved Posters</h1>
                            <p className="mt-2 text-lg text-center text-black">Discover visual insights submitted by our research community</p>
                        </div>
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
                                        </select>
                                        <span className="dropdown-arrow flex items-center justify-center"><IoIosArrowDropdownCircle className="text-testingColorBlack" size={16}/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Button (for publishers and admins) */}
                        {(role === 'publisher' || role === 'admin') && (
                            <div className="publisher-stuff">
                                <button className="upload" onClick={() => setShowUpload(true)}>
                                    Upload Poster
                                </button>
                            </div>
                        )}

                        {/* Upload Popup */}
                        {showUpload && (
                            <>
                                <div className="popup-backdrop" onClick={() => setShowUpload(false)}></div>
                                <div className="upload-popup">
                                    <button className="exit-upload" onClick={() => setShowUpload(false)}>
                                        <ImCross />
                                    </button>
                                    <h2>Upload Poster</h2>
                                    <form onSubmit={handleSubmit} className="input-container">
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Title"
                                            value={uploadFile.title}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="keywords"
                                            placeholder="Keywords (comma-separated)"
                                            value={uploadFile.keywords.join(", ")}
                                            onChange={handleChange}
                                        />
                                        <textarea
                                            name="description"
                                            placeholder="Description"
                                            value={uploadFile.description}
                                            onChange={handleChange}
                                        />
                                        <div {...getRootProps()} className="drop-container">
                                            <input {...getInputProps()} />
                                            <p>Drag & drop a file here, or click to select</p>
                                            <p>Accepted formats: JPEG, PNG, GIF, PDF</p>
                                            {uploadFile.file && (
                                                <p>Selected file: {uploadFile.file.name}</p>
                                            )}
                                        </div>
                                        <button type="submit">Upload</button>
                                    </form>
                                </div>
                            </>
                        )}

                        {/* Display Posters */}
                        <div className="posters-section">
                            <h2>Approved Posters</h2>
                            <Posters posters={posters} onPosterClick={(poster) => handlePosterPopup(poster)} />
                        </div>

                        {/* My Posters Section */}
                        {role !== 'guest' && (
                            <div className="posters-section">
                                <h2>My Posters</h2>
                                {loadingMyPosters ? (
                                    <div className="loading-container">
                                        <div className="loading-spinner"></div>
                                        <p>Loading your posters...</p>
                                    </div>
                                ) : (
                                    myPosters.length > 0 ? (
                                        <Posters posters={myPosters} onPosterClick={(poster) => handlePosterPopup(poster)} />
                                    ) : (
                                        <p>No posters found.</p>
                                    )
                                )}
                            </div>
                        )}

                        {/* Pending Posters Section (Admin Only) */}
                        {role === 'admin' && (
                            <div className="posters-section">
                                <h2>Pending Posters</h2>
                                <Posters posters={pendingPosters} onPosterClick={(poster) => handlePosterPopup(poster, "pending")} />
                            </div>
                        )}

                        {/* Poster Popup */}
                        {popupPoster && (
                            <div className="poster-popup">
                                <div className="poster-popup-content">
                                    <button className="close-popup" onClick={handleClosePopup}>
                                        <ImCross />
                                    </button>
                                    <div className="poster-details">
                                        <h2>{popupPoster.title}</h2>
                                        <p><strong>Author:</strong> {popupPoster.author}</p>
                                        <p><strong>Description:</strong> {popupPoster.description}</p>
                                        <p><strong>Keywords:</strong> {popupPoster.keywords?.join(', ')}</p>
                                        <p><strong>File:</strong> {popupPoster.file?.name}</p>
                                        <div className="button-group">
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(
                                                            `http://localhost:8081/posters/${popupPoster._id}/file`,
                                                            { 
                                                                credentials: 'include',
                                                                headers: {
                                                                    'Accept': '*/*'
                                                                }
                                                            }
                                                        );
                                                        
                                                        if (!response.ok) {
                                                            throw new Error('Failed to fetch file');
                                                        }
                                                        
                                                        const contentType = response.headers.get('content-type');
                                                        const contentDisposition = response.headers.get('content-disposition');
                                                        const blob = await response.blob();
                                                        
                                                        const url = window.URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.style.display = 'none';
                                                        a.href = url;
                                                        a.download = popupPoster.file.name;
                                                        
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        
                                                        // Clean up
                                                        setTimeout(() => {
                                                            document.body.removeChild(a);
                                                            window.URL.revokeObjectURL(url);
                                                        }, 100);
                                                    } catch (error) {
                                                        console.error('Error downloading file:', error);
                                                        alert('Error downloading file. Please try again.');
                                                    }
                                                }}
                                                className="download-btn"
                                            >
                                                Download
                                            </button>
                                            {role === 'admin' && popupPoster.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleApprovePoster(popupPoster._id)}
                                                    className="approve-btn"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostersPage;
