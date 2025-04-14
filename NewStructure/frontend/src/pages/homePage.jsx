import React from "react";
import "./homePage.css"
import Gallery from "../components/photoGallery.jsx";
import Cards from "../components/HomePage/sectionCards.jsx"
import Hero from "../components/HomePage/HeroSection.jsx"

function Home() {
    return (
        <div className="homePage">
            <div className="gallery">
                <Hero />
            </div>
            <div>
                <Cards />
            </div>
            <div>
                <Gallery />
            </div>

        </div>
    );
}
export default Home;
