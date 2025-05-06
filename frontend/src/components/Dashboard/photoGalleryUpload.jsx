import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImCross } from "react-icons/im";
import API_BASE_URL from "../../config.js";

const PhotoGalleryUpload = () => {
    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadLimitReached, setUploadLimitReached] = useState(false);

    // Handle drop event
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        console.log("Dropped file:", file);
        setUploadPhoto(file);
    };

    // Handle photo upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadPhoto) {
            alert("Please provide an image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadPhoto);

        try {
            setLoading(true);
            setError("");
            const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Photo uploaded successfully!");
                setUploadPhoto(null);
                fetchPhotos();
            } else {
                const errText = await response.text();
                setError("Failed to upload photo.");
                if (errText.includes("Can't upload more files")) {
                    setUploadLimitReached(true);
                }
            }
        } catch (err) {
            setError("An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch gallery photos
    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/photos`);
            const data = await response.json();
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    };

    // Delete a photo
    const deletePhoto = async (photoName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/photos/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: photoName }),
            });

            if (response.ok) {
                setPhotos(photos.filter((photo) => photo.name !== photoName));
                setUploadLimitReached(false)
            } else {
                alert("Failed to delete photo.");
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPhotos();
    }, []);

    // Dropzone setup
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/png": [] },
        multiple: false,
    });

    return (
        <div className="flex flex-col md:flex-row items-start gap-6 w-full px-4">
            {/* Upload Form */}
            <div className="flex flex-col w-full max-w-lg p-4 bg-transparent border-solid rounded-xl border-testingColorOutline mt-6">
                <div className="mb-6">
                    <h2 className="text-white mb-2">Add Image</h2>
                    <p className="text-white text-sm">Upload a new image to the photo gallery</p>
                </div>
                <form onSubmit={handleUpload}>
                    <div className="space-y-4 hover:bg-testingColorHover rounded-xl">
                        <div {...getRootProps()} className="border-2 border-dashed border-testingColorOutline bg-transparent rounded-xl p-6 cursor-pointer transition-all hover:border-red-600">
                            <input {...getInputProps()} />
                            <p className="text-testingColorSubtitle text-center">Drop files here, or click to select</p>
                            {uploadPhoto && <p className="text-cirtRed text-center">{uploadPhoto.name}</p>}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {loading && <p className="text-white text-sm mt-2">Uploading...</p>}
                    {uploadLimitReached && (
                        <p className="text-yellow-500 text-sm mt-2">You cannot upload more than 10 photos.</p>
                    )}
                    <div className="pt-4 pb-2">
                        <button
                            type="submit"
                            disabled={loading || uploadLimitReached}
                            className="w-full border border-testingColorOutline hover:bg-testingColorHover hover:border-cirtRed bg-transparent text-white">
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Gallery */}
            <div className="w-full md:flex-1 max-h-[80vh] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 border pr-0 border-testingColorOutline p-4 pb-0 rounded-xl">
                {photos.map((photo) => (
                    <div key={photo.name} className="relative border-solid border-testingColorOutline rounded-xl overflow-hidden">
                        <button
                            onClick={() => deletePhoto(photo.name)}
                            className="absolute right-2 top-2 text-white bg-testingColorOutline flex items-center justify-center z-10 rounded-full">
                            <ImCross className="text-white" size={10} />
                        </button>
                        <img src={photo.url} alt={photo.title} className="w-full h-64 object-cover" />
                        <div className="bg-black bg-opacity-50 text-white text-center p-2">{photo.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGalleryUpload;