import React, {useState, useEffect} from "react";
import { useDropzone } from 'react-dropzone';
import Navbar from "../components/navbar.jsx";
import "./publicationsPage.css"
import Pubs from './publications.jsx';

function Publications({ role, email, name }) {
    const [showUpload, setShowUpload] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [publications, setPublications] = useState([]);
    //const [searchPubName, setSearchPubName] = useState([]); // should drop everything form first list when search
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    role = 'publisher';

    // list for uploading a publication
    const [uploadFile, setUploadFile] =
        useState({
            title: '',
            author: [name],
            email: email,
            keywords: [],
            file: '',
            status: '',
        });

    useEffect(() => {
        fetch("http://localhost:8081/api/publications?limit=10")
            .then(response => response.json())  // Expecting an array of publications
            .then((data) => {
                setPublications(data);
            })
            .catch((error) => {
                console.error("Error fetching publications:", error);
                setErrorMessage("Failed to load publications. Please try again later.");
            });
    }, []);


    // Handles typing in for uploading a new publication
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "keywords") {
            setUploadFile(prev => ({ ...prev, keywords: value.split(",") }));
        } else if (name === "author") {
            setUploadFile(prev => ({ ...prev, author: value.split(",") }));
        } else {
            setUploadFile(prev => ({ ...prev, [name]: value }));
        }
    };

    // submition handler for uploading new publications
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");  // remove previous errors before sending new message

        if (!uploadFile.title || !uploadFile.author || !uploadFile.file) {
            alert("Please fill all fields.");
            return;
        }
        console.log('email is '+ email);
        const formData = new FormData();
        formData.append("title", uploadFile.title);
        formData.append("author", JSON.stringify(uploadFile.author));
        formData.append("email", uploadFile.email);
        formData.append("keywords", JSON.stringify(uploadFile.keywords));
        formData.append("file", uploadFile.file);

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

    return (
        <div className="publisher-stuff">
            {role === "publisher" && (
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
                                    <input type="text" name="keywords" placeholder="Keywords" value={uploadFile.keywords} onChange={handleChange} required />
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


                    <h2>Under Review</h2>
                    {}
                </div>
            )}

            <h2>Publications</h2>
            <div className="search-bar">
                <input type="text" id="search" className="search-bar" onKeyUp="searchText()" placeholder="Search..."/>
                <select id="filter" className="filter-menu" onChange="searchText()">
                    <option value="title">by Title</option>
                    <option value="author">by Author</option>
                    <option value="keyword">by Keyword</option>
                </select>
            </div>
            <div className="pagination">
                <Pubs pubs={publications} />
            </div>
        </div>
    );
}
export default Publications;
