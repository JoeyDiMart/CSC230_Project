import './photoGallery.css'
import { useState, useEffect } from "react";

function Gallery( {photos, setPhotos} ) {
    const [photos, setPhotos] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8081/api/photos")
            .then(response => response.json()) // Expecting an array of Base64 strings
            .then((data) => {
                console.log("Received images:", data); // Debugging
                setPhotos(data);
            })
            .catch(error => console.error("Error fetching photos:", error));
    }, []);


    useEffect(() => {
        if (photos.length === 0) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [photos]);

    if (photos.length < 3) return <p>Loading...</p>; // Handle case where there are fewer than 3 images

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
