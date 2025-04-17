import React from "react";
import { Link } from "react-router-dom";
import "./homePage.css"
import Gallery from "../components/photoGallery.jsx";
import Cards from "../components/HomePage/sectionCards.jsx"
import Hero from "../components/HomePage/HeroSection.jsx"
import AboutUs from "../components/HomePage/AboutUs.jsx"
import { FaArrowRight } from "react-icons/fa";



function Home() {
    return (
        <div className="homePage bg-white">
            <div className="gallery w-full">
                <Hero />
            </div>
            <section>
                <AboutUs />
            </section>

            <section>
                <div>
                    <Cards />
                    <Link to={"/publications"}>
                        <div className="flex text-center justify-center">
                            <span><p>View All Publications</p></span>
                            <span className="flex items-center ml-2 text-cirtRed"><FaArrowRight /></span>
                        </div>
                    </Link>
                </div>
            </section>

            <section>
                <Gallery />
            </section>
        </div>
    );
}
export default Home;
