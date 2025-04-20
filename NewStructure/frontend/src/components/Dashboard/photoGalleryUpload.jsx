import React, { useState } from "react";
import { useDropzone } from 'react-dropzone';

const PhotoGalleryUpload = () => {
    // State for the uploaded photo and image title
    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [imageTitle, setImageTitle] = useState("");

    // Handle drop event
    const onDrop = (acceptedFiles) => {
        console.log('Accepted files:', acceptedFiles);
        const file = acceptedFiles[0];
        setUploadPhoto(file);
    };

    // Handle upload event
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadPhoto || !imageTitle) {
            alert("Please provide an image and a title.");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadPhoto);
        formData.append("title", imageTitle);

        try {
            console.log("Uploading photo with title:", imageTitle);
            const response = await fetch("http://localhost:8081/api/photos/upload", {
                method: "POST",
                body: formData,
            });
            console.log("Response from server:", response);
            if (response.ok) {
                alert("Photo uploaded successfully!");
            } else {
                alert("Failed to upload photo.");
            }
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    };

    // Setup react-dropzone
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ['.jpeg', '.png'],
        multiple: false
    });

    return (
        <div className="flex justify-center items-center h-[650px]">
            <div className="flex flex-col w-full max-w-lg p-4 bg-transparent border-solid rounded-xl border-testingColorOutline">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-white mb-2">Add Image</h2>
                    <p className="text-white text-sm mb-0">Fill out the information below to upload a new image to the photo gallery</p>
                </div>
                <form onSubmit={handleUpload}>
                {/* Image Title and Input */}
                <div className="mb-4">
                    <p className="text-white block mt-0">Image Title</p>
                    <input
                        placeholder="Title"
                        className="box-border w-full bg-transparent border-solid rounded-sm border-testingColorOutline px-2 py-1 focus:border-transparent focus:outline-cirtRed focus:ring-0"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        required
                    />
                </div>

                {/* File Uploading */}
                
                <div className="space-y-4 hover:bg-testingColorHover rounded-xl">
                    <div {...getRootProps()} className="border-2 border-dashed border-testingColorOutline bg-transparent rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-red-600">
                        <input {...getInputProps()} />
                        <p className="text-testingColorSubtitle flex items-center justify-center cursor-pointer">Drop files here, or click to select</p>
                        {uploadPhoto && <p className="text-cirtRed flex items-center justify-center">{uploadPhoto.name}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 pb-2">
                    <button type="submit" className="w-full border border-solid border-testingColorOutline hover:bg-testingColorHover hover:border-cirtRed bg-transparent">Upload</button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default PhotoGalleryUpload;