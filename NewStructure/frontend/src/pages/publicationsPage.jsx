 import React, {useState, useEffect} from "react";
import { useDropzone } from 'react-dropzone';
import Navbar from "../components/navbar.jsx";
import "./publicationsPage.css"

function Publications({ role, email, name }) {
    const [showUpload, setShowUpload] = useState(false);
    role = 'publisher'

    const [uploadFile, setUploadFile] =
        useState({
            title: '',
            author: [name],
            email: email,
            keywords: [],
            file: '',
        });
    const handleChange = (e) => {
        setUploadFile({ ...uploadFile, [e.target.name]: e.target.value });
    };

    // Handle drop event
    const onDrop = (acceptedFiles) => {
        console.log('Accepted files:', acceptedFiles);
        const file = acceptedFiles[0];
        setUploadFile(file);
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
                        <div className="upload-popup">
                            <button onClick={() => setShowUpload(false)} className="exit-upload">X</button>
                            <h2>Upload a Publication</h2>
                            <div className="input-container">
                                <input type="title" name="title" placeholder="Title" value={uploadFile.title} onChange={handleChange} required />
                                <div className="input-list">
                                    <input type="author" name="author" placeholder="Authors" value={uploadFile.author} onChange={handleChange} required />
                                    <input type="keywords" name="keywords" placeholder="Keywords" value={uploadFile.keywords} onChange={handleChange} required />
                                </div>
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>Drag & Drop PDF here, or click to select</p>
                                    {uploadFile && <p>File uploaded is {uploadFile.name} {uploadFile.title}</p>}
                                </div>
                            </div>
                        </div>
                    )}


                    <h2>Under Review</h2>
                </div>
            )}
            <h2>Publications</h2>
            <div className="search-bar">
                <input type="text" id="search" class="search-bar" onKeyUp="searchText()" placeholder="Search..."/>
                <select id="filter" className="filter-menu" onChange="searchText()">
                    <option value="title">by Title</option>
                    <option value="author">by Author</option>
                    <option value="keyword">by Keyword</option>
                </select>
            </div>

        </div>
    );
}

export default Publications;
