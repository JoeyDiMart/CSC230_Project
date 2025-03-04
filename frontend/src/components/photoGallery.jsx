import React, { useEffect, useState } from "react";

function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [leftIndex, setLeftIndex] = useState(0);
    const [centerIndex, setCenterIndex] = useState(1);
    const [rightIndex, setRightIndex] = useState(2);

    /*
    useEffect(() => {
        // Fetch images from the backend
        fetch("http://localhost:8081/api/photos")
            .then((response) => response.json())
            .then((data) => setPhotos(data))
            .catch((error) => console.error("Error fetching photos:", error));
    }, []);
     */

    // be  sure to remove this once connected to backend
    useEffect(() => {
        // For testing, manually add photos to the list
        const testPhotos = [
            "../public/test1.png",
            "../public/test2.png",
            "../public/test3.png"
        ];
        setPhotos(testPhotos); // Update state immutably
    }, []); // This effect runs once on mount

    useEffect(() => {
        if (photos.length === 0) { return }

        const interval = setInterval(() => {
            setLeftIndex((prevIndex) => (prevIndex + 1) % photos.length);
            setCenterIndex((prevIndex) => (prevIndex + 1) % photos.length);
            setRightIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [photos]);

    return (
        <div className="gallery">
            <img key="side" src={photos[leftIndex]} alt="leftPhoto" />
            <img key="center" src={photos[centerIndex]} alt="centerPhoto" />
            <img key="side" src={photos[rightIndex]} alt="rightPhoto" />
        </div>

    );
}

    export default Gallery;
