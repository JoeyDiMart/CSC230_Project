import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserPlus, FaCamera, FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import {useState} from "react";

const links = [

  { link: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={18} /> },
  { link: "/dashboard/addUser", label: "Add User", icon: <FaUserPlus size={16} /> },
  { link: "/dashboard/photoGalleryUpload", label: "Photo Gallery", icon: <FaCamera size={16} /> },
];

const Sidebar = () => {
    // Navigation
  const { pathname } = useLocation();

  //UseState for the closed or opened Sidebar
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <aside className={`h-screen overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? "w-16" : "w-64"}`}>
      <nav className="h-full flex flex-col bg-cirtRed border-r shadow-sm">

        {/* Top Section */}
        <div className={`p-4 pb-2 pt-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-4`}>
        {!isCollapsed &&(
            <>
                <img className="w-[50px] h-[50px]" src="/UTampa_mark.png" alt="Logo" />
                <h1 className="text-xl font-bold text-white">CIRT</h1>
            </>
        )}
          
        {/* Collapsed Button */}
        <button onClick={toggleSidebar} className="text-white focus:outline-none ml-auto bg-transparent ">{isCollapsed ? <FaChevronCircleRight className="size-5"/> : <FaChevronCircleLeft/>}</button>
        </div>


        {/* Nav Links */}
        <ul className="flex flex-col p-4 pt-0 list-none space-y-3">
          {links.map(({ link, label, icon }) => (
            <li key={label}>
              <Link to={link} className={`py-2 px-4 flex items-center rounded-lg transition-all duration-300 ${pathname === link ? "bg-cirtGrey text-white" : "bg-opacity-60 text-white hover:bg-cirtGrey hover:bg-opacity-100"}
                ${!isCollapsed ? "justify-start" : "justify-end"}
              `}>
                <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-start"}`}>
                    <span className="text-xl">{icon}</span>  
                    <span className={` ml-3 text-lg font-medium transition-all duration-200 ${isCollapsed ? "ml-0 opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100 w-auto"}`}>
                    {label}
                    </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

      </nav>
    </aside>
  );
};

export default Sidebar;

  