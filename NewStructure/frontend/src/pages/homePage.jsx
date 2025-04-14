import React from "react";
import "./homePage.css"
import Gallery from "../components/photoGallery.jsx";
import Cards from "../components/HomePage/sectionCards.jsx"

function Home() {
    return (
        <div className="homePage">
            <div className="gallery">
                <Gallery />
            </div>
            <div>
                <Cards />
            </div>
            

        </div>
    );
}
export default Home;
