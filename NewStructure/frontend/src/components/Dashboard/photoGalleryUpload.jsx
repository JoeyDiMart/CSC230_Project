import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImCross } from "react-icons/im";

const PhotoGalleryUpload = () => {
    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [imageTitle, setImageTitle] = useState("");
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadLimitReached, setUploadLimitReached] = useState(false); // New state to track the upload limit

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
                if (errText.includes("Can't upload more files")) {
                    setUploadLimitReached(true); // Set the upload limit flag to true if limit is reached
                }
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };
    const fetchPhotos = async () => {
        try {
            console.log("Fetching photos from hardcoded data...");
            const data = [
                {
                    name: "image0.jpeg",
                    url: "/photos/image0.jpeg", // Use relative path
                    title: "Image 0"
                },
                {
                    name: "image1.jpeg",
                    url: "/photos/image1.jpeg",
                    title: "Image 1"
                },
                {
                    name: "image2.jpeg",
                    url: "/photos/image2.jpeg",
                    title: "Image 2"
                },
                {
                    name: "image3.jpeg",
                    url: "/photos/image3.jpeg",
                    title: "Image 3"
                },
                {
                    name: "image4.jpeg",
                    url: "/photos/image4.jpeg",
                    title: "Image 4"
                },
                {
                    name: "image5.jpeg",
                    url: "/photos/image5.jpeg",
                    title: "Image 5"
                },
                {
                    name: "image6.jpeg",
                    url: "/photos/image6.jpeg",
                    title: "Image 6"
                },
                {
                    name: "image7.jpeg",
                    url: "/photos/image7.jpeg",
                    title: "Image 7"
                },
                {
                    name: "image8.jpeg",
                    url: "/photos/image8.jpeg",
                    title: "Image 8"
                },
                {
                    name: "image9.jpeg",
                    url: "/photos/image9.jpeg",
                    title: "Image 9"
                },
            ];
            console.log(data);
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    };
    // todo change this back when done
    // // Fetch gallery photos
    // const fetchPhotos = async () => {
    //     try {
    //         console.log("Fetching photos from server...");
    //         const response = await fetch("http://localhost:8081/api/photos");
    //         const data = await response.json();
    //         console.log(data)
    //         setPhotos(data);
    //     } catch (error) {
    //         console.error("Error fetching photos:", error);
    //     }
    // };

// Delete a photo (sends POST with file name to backend)
    const deletePhoto = async (photoName) => {
        try {
            console.log("Deleting photo with name:", photoName);
            const response = await fetch("http://localhost:8081/api/photos/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ filename: photoName }),
            });

            if (response.ok) {
                console.log("Photo deleted successfully.");
                setPhotos(photos.filter((photo) => photo.name !== photoName));
            } else {
                const errText = await response.text();
                console.error("Delete failed:", errText);
                alert("Failed to delete photo.");
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
        }}

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
        <div className="flex flex-col md:flex-row items-start gap-6 w-full px-4">
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

                    {/* Display limit reached message */}
                    {uploadLimitReached && (
                        <p className="text-yellow-500 text-sm mt-2">
                            You cannot upload more than 10 photos.
                        </p>
                    )}

                    <div className="pt-4 pb-2">
                        <button
                            type="submit"
                            disabled={loading|| uploadLimitReached}
                            className="w-full border border-testingColorOutline hover:bg-testingColorHover hover:border-cirtRed bg-transparent text-white">
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Gallery */}
            <div className="w-full md:flex-1 max-h-[80vh] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 border pr-0 border-testingColorOutline p-4 pb-0 rounded-xl">
                {photos.map((photo) => (
                    <div key={photo.name} className="relative border-solid border-testingColorOutline  rounded-xl overflow-hidden">
                        <button
                            onClick={() => deletePhoto(photo.name)}
                            className=" absolute right-2 top-2 text-white bg-testingColorOutline flex items-center justify-center z-10 rounded-full">
                            <ImCross className="text-white" size={10} />
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
