import React from "react";
import {IoMdSettings } from "react-icons/io";
import { IoPeopleSharp, IoInformationCircle } from "react-icons/io5";


function Cards (){
    return (
        <div className="flex justify-center items-center py-10 bg-testingColorBackground">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full px-6">
                
                {/* Card 1 - About CIRT */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-testingColorOutline transition-transform duration-500 hover:scale-[1.02]">
                    <div className="flex items-center">
                        <span className="flex items-center"><IoInformationCircle className="text-cirtRed m-2" size={24}/></span>
                        <span><h2 className="text-xl font-semibold text-testingColorBlack ">About CIRT</h2></span>
                    </div>
                    
                    
                    <p>
                        The vision of the Criminology Institute for Research and Training (CIRT) is to become a catalyst and leader in research for criminal justice related organizations locally and nationwide.
                    </p>
                    <p>Organized in 2023, the CIRT is designed to offer a variety of academic pursuits including: education for students and training for criminal justice professionals; engaging in local, regional, and nationwide criminal justice research and policy events; publishing and promoting high-level multidisciplinary research; expanding faculty and student reach in grant and funding opportunities; and coordinating further collaboration with local criminal justice agencies.
                    </p>
                    <p>
                        CIRT is based out of the College of Social Sciences, Mathematics and Education (CSSME) and is linked to the Department of Criminology and Criminal Justice at The University of Tampa.
                    </p>
                    </div>

                    {/* Card 2 - CIRT Function */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-testingColorOutline transition-transform duration-500 hover:scale-[1.02]">
                     <div className="flex items-center">
                        <span className="flex items-center"><IoMdSettings className="text-cirtRed m-2" size={24}/></span>
                        <span><h2 className="text-xl font-semibold text-testingColorBlack ">CIRT Function</h2></span>
                    </div>
                    <p>
                        The CIRT supports the vision of The University by strengthening programs, supporting graduate success, increasing departmental recognition, and creating funding opportunities.
                    </p>
                    <p>The CIRT has four specific functions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Encourage networking and collaboration between UT scholars and criminal justice organizations;</li>
                        <li>Provide learning resources and training for students, faculty, and professionals;</li>
                        <li>Prepare students for future careers in criminal justice;</li>
                        <li>Serve as a hub for research, training, and engagement.</li>
                    </ol>
                </div>

                {/* Card 3 - Faculty Expertise */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-testingColorOutline transition-transform duration-500 hover:scale-[1.02]">
                    <div className="flex items-center">
                        <span className="flex items-center"><IoPeopleSharp className="text-cirtRed m-2" size={24}/></span>
                        <span><h2 className="text-xl font-semibold text-testingColorBlack ">Faculty Expertise</h2></span>
                    </div>
                <p>
                    CIRT faculty bring extensive expertise in corrections, cybercrime, financial crime, policing, and policy. Their work helps bridge academia and real-world applications.
                </p>
                <p>
                    Faculty provide student training in data analysis, GIS, crime mapping, and qualitative methods, expanding hands-on research and career preparedness in criminology.
                </p>
                </div>

            </div>
        </div>



    );
}
export default Cards;