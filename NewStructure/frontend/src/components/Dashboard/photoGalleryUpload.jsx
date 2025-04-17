import React from "react";
import { Link } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { useState } from "react";



const PhotoGalleryUpload = () => {
        
 // Handle drop event
 const [uploadPhoto, setUploadPhoto] = useState("");
 const onDrop = (acceptedFiles) => {
     console.log('Accepted files:', acceptedFiles);
     const file = acceptedFiles[0];
     setUploadPhoto(prev => ({ ...prev, file }));
 };

 // Setup react-dropzone
 const { getRootProps, getInputProps } = useDropzone({
     onDrop,
     accept: ['.jpeg', '.png'],
     multiple: false
 });

    return(
        <div className="flex justify-center items-center">
            <div className=" p-4 bg-transparent border-solid rounded-xl border-testingColorOutline">
                <div>
                    <h2 className="text-white text-2xl mb-2">Add Image</h2>
                    <p className="text-white text-sm">Fill out the information below to upload a new image to the photo gallery</p>
                </div>
                <div>
                    <form className="space-y-4">
                        <div>
                            <div {...getRootProps()} className="drop-container">
                                <input {...getInputProps()} />
                                <p>Drop files here, or click to select</p>
                                {uploadPhoto && <p>TEST</p>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PhotoGalleryUpload;