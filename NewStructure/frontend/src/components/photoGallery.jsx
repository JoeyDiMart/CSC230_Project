import './photoGallery.css'
import { useState, useEffect } from "react";

function Gallery () {
    const [photos, setPhotos] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8081/api/photos")
            .then(response => {
                return response.json();
            })            .then((data) => {
                console.log("Fetched photos:", data);
                const photoUrls = data.map(photo => `${photo.url}`);
                console.log("Photo URLs:", photoUrls);
                setPhotos(photoUrls);
                console.log("Updated photos state:", photoUrls);            })
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
    console.log("Photos"+photos);

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
