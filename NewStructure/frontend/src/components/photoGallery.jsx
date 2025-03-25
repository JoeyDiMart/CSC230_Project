import React, {Fragment, useEffect, useState} from "react";
import './photoGallery.css'

function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [index, setIndex] = useState(0);


    useEffect(() => {
        // Fetch images from the backend
        fetch("http://localhost:8081/api/photos") // Make sure this is the correct route
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setPhotos(data))
            .catch((error) => console.error("Error fetching photos:", error));
    }, []);


    useEffect(() => {
        if (photos.length === 0) { return }

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [photos]);

    const leftIndex = (index + photos.length - 1) % photos.length;
    const centerIndex = index;
    const rightIndex = (index + 1) % photos.length;

    return (
        <div className="gallery">
            <div className="photo-container">
            <img key="left" src={photos[leftIndex]} alt="leftPhoto" />
            </div>
            <div className="photo-container center-photo">
                <img key="center" src={photos[centerIndex]} alt="centerPhoto" />
            </div>
            <div className="photo-container">
                <img key="right" src={photos[rightIndex]} alt="rightPhoto" />
            </div>
        </div>

    );
}

    export default Gallery;
