import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
const PhotoGalleryUpload = () => {
    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [imageTitle, setImageTitle] = useState("");
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle drop event
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        console.log("Dropped file:", file);
        setUploadPhoto(file);
    };

    // Handle upload event
    const handleUpload = async (e) => {
        e.preventDefault();
        console.log("Upload triggered");

        if (!uploadPhoto || !imageTitle) {
            console.warn("Missing image or title.");
            alert("Please provide an image and a title.");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadPhoto);
        formData.append("title", imageTitle);
        console.log("Prepared FormData:", uploadPhoto.name, imageTitle);

        try {
            setLoading(true);
            setError("");
            console.log("Sending POST request to /api/photos/upload");
            const response = await fetch("http://localhost:8081/api/photos/upload", {
                method: "POST",
                body: formData,
            });

            console.log("Server response:", response);

            if (response.ok) {
                alert("Photo uploaded successfully!");
                setUploadPhoto(null);
                setImageTitle("");
                fetchPhotos(); // Refresh gallery
            } else {
                const errText = await response.text();
                console.error("Upload failed:", errText);
                setError("Failed to upload photo.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch gallery photos
    const fetchPhotos = async () => {
        try {
            console.log("Fetching photos from server...");
            const response = await fetch("http://localhost:8081/api/photos");
            const data = await response.json();
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    };

    // Delete a photo
    const deletePhoto = async (photoId) => {
        try {
            console.log("Deleting photo with ID:", photoId);
            const response = await fetch(`http://localhost:8081/api/photos/${photoId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("Photo deleted successfully.");
                setPhotos(photos.filter((photo) => photo.id !== photoId));
            } else {
                const errText = await response.text();
                console.error("Delete failed:", errText);
                alert("Failed to delete photo.");
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    // Initial fetch
    useEffect(() => {
        console.log("Component mounted: fetching photos...");
        fetchPhotos();
    }, []);

    // Dropzone setup
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
        },
        multiple: false,
    });

    return (
        <div className="flex flex-col items-center min-h-screen">
            {/* Upload Form */}
            <div className="flex flex-col w-full max-w-lg p-4 bg-transparent border-solid rounded-xl border-testingColorOutline mt-6">
                <div className="mb-6">
                    <h2 className="text-white mb-2">Add Image</h2>
                    <p className="text-white text-sm">Fill out the information below to upload a new image to the photo gallery</p>
                </div>
                <form onSubmit={handleUpload}>
                    <div className="mb-4">
                        <p className="text-white">Image Title</p>
                        <input
                            placeholder="Title"
                            className="box-border w-full bg-transparent border-solid rounded-sm border-testingColorOutline px-2 py-1 focus:outline-cirtRed"
                            value={imageTitle}
                            onChange={(e) => {
                                console.log("Title changed:", e.target.value);
                                setImageTitle(e.target.value);
                            }}
                            required
                        />
                    </div>

                    <div className="space-y-4 hover:bg-testingColorHover rounded-xl">
                        <div {...getRootProps()} className="border-2 border-dashed border-testingColorOutline bg-transparent rounded-xl p-6 cursor-pointer transition-all hover:border-red-600">
                            <input {...getInputProps()} />
                            <p className="text-testingColorSubtitle text-center">Drop files here, or click to select</p>
                            {uploadPhoto && <p className="text-cirtRed text-center">{uploadPhoto.name}</p>}
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {loading && <p className="text-white text-sm mt-2">Uploading...</p>}

                    <div className="pt-4 pb-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border border-testingColorOutline hover:bg-testingColorHover hover:border-cirtRed bg-transparent text-white">
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Gallery */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl p-4">
                {photos.map((photo) => (
                    <div key={photo.name} className="relative border border-testingColorOutline rounded-xl overflow-hidden">
                        <button
                            onClick={() => deletePhoto(photo.name)}
                            className="absolute top-2 right-2 text-white bg-cirtRed hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center z-10">
                            ✕
                        </button>
                        <img src={photo.url} alt={photo.title} className="w-full h-64 object-cover" />
                        <div className="bg-black bg-opacity-50 text-white text-center p-2">
                            {photo.title}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGalleryUpload;
