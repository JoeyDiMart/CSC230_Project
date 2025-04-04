import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserPlus, FaCamera, FaChevronCircleLeft, FaChevronCircleRight, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import UserInfo from "../Dashboard/Sidebar/UserInfo"
import SidebarItems from "../Dashboard/Sidebar/SidebarItem";
import Header from "../Dashboard/Sidebar/Header"


const links = [
  { link: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
  { link: "/dashboard/addUser", label: "Add User", icon: <FaUserPlus size={20} /> },
  { link: "/dashboard/photoGalleryUpload", label: "Photo Gallery", icon: <FaCamera size={20} /> },
];

const user = {
    name: "Sebastian",
    email: "sebastian@example.com",
    avatar: "/UTampa_mark.png",
  };

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/"); // Navigate to the home page after logout
  };
  

  return (
    <aside className={`h-screen overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? "w-16" : "w-48"} `}>
      <nav className="h-full flex flex-col bg-testingColorOutline">
        {/* Sidebar Header */}
        <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />


        {/* Navigation Links */}
        <SidebarItems isCollapsed={isCollapsed} />
        
        {/* User Information */}
        <UserInfo user={user} isCollapsed={isCollapsed} handleLogout={handleLogout}/>
      </nav>
    </aside>
  );
};

export default Sidebar;
