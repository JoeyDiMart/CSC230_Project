import React from "react";
import { Link } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import { useState } from "react";
import SectionCards from "./sectionCards";



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
        <div className="flex justify-center items-center h-[650px]">
            <div className="flex flex-col w-full max-w-lg p-4 bg-transparent border-solid rounded-xl border-testingColorOutline ">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-white mb-2">Add Image</h2>
                    <p className="text-white text-sm mb-0">Fill out the information below to upload a new image to the photo gallery</p>
                </div>

                {/* Image Title and Input */}
                <div className="mb-4">
                    <p className="text-white block mt-0">Image Title</p>
                    <input placeholder="Title" className=" box-border w-full bg-transparent border-solid rounded-sm border-testingColorOutline px-2 py-1 focus:border-transparent focus:outline-cirtRed focus:ring-0" required></input>
                </div>
                {/* File Uploading */}
                <form>
                    <div className="space-y-4 hover:bg-testingColorHover rounded-xl">
                        <div {...getRootProps()} className="border-2 border-dashed border-testingColorOutline bg-transparent rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-red-600">
                            <input {...getInputProps()} />
                            <p className="text-testingColorSubtitle flex items-center justify-center cursor-pointer">Drop files here, or click to select</p>
                            {uploadPhoto && <p className="text-white">{uploadPhoto.name}</p>}
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
}

export default PhotoGalleryUpload;