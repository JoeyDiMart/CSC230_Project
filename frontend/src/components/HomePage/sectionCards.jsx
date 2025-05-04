import React from "react";
import {IoMdSettings } from "react-icons/io";
import { IoPeopleSharp, IoInformationCircle } from "react-icons/io5";


function Cards (){
    return (
        <div className="flex justify-center items-center py-10 bg-testingColorCardsBackground">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full px-6">
                
                {/* Card 1 - About CIRT */}
                <div className="relative bg-white rounded-2xl shadow-lg p-6 space-y-4 transition-transform duration-500 hover:scale-[1.02] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-cirtRed before:rounded-t-2xl">
                    <div className="flex items-center">
                        <span className="flex items-center"><IoInformationCircle className="text-cirtRed m-2" size={24}/></span>
                        <span><h2 className="text-xl font-semibold text-testingColorBlack">Our Mission</h2></span>
                    </div>
                    <p>
                        The Criminology Institute for Research and Training (CIRT), aims to lead in criminal justice research locally and nationally. It supports education, professional training, research, and collaboration with justice agencies.                    
                    </p>
                </div>

                {/* Card 2 - CIRT Function */}
                <div className="relative bg-white rounded-2xl shadow-lg p-6 space-y-4 transition-transform duration-500 hover:scale-[1.02] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-cirtRed before:rounded-t-2xl">
                    <div className="flex items-center">
                        <span className="flex items-center"><IoMdSettings className="text-cirtRed m-2" size={24}/></span>
                        <span><h2 className="text-xl font-semibold text-testingColorBlack ">CIRT Function</h2></span>
                    </div>
                        <p>
                            The CIRT supports the vision of The University by strengthening programs, supporting graduate success, increasing departmental recognition, and creating funding opportunities.
                        </p>
                </div>

                {/* Card 3 - Faculty Expertise */}
                <div className="relative bg-white rounded-2xl shadow-lg p-6 space-y-4 transition-transform duration-500 hover:scale-[1.02] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[6px] before:bg-cirtRed before:rounded-t-2xl">
                    <div className="flex items-center">
                        <span className="flex items-center"><IoPeopleSharp className="text-cirtRed m-2" size={24}/></span>
                        <span><h2 className="text-xl font-semibold text-testingColorBlack ">Faculty Expertise</h2></span>
                    </div>
                    <p>
                        The CIRT advances UT’s mission by enhancing programs, supporting graduates, boosting recognition, and securing funding. Its core goals include fostering collaboration, offering training, preparing students for careers, and serving as a hub for research and engagement.
                    </p>
                </div>

            </div>
        </div>
    );
}
export default Cards;