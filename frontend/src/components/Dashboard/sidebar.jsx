import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserPlus, FaCamera, FaChevronCircleLeft, FaChevronCircleRight, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

const links = [
  { link: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
  { link: "/dashboard/addUser", label: "Add User", icon: <FaUserPlus size={20} /> },
  { link: "/dashboard/photoGalleryUpload", label: "Photo Gallery", icon: <FaCamera size={20} /> },
];

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
      <nav className="h-full flex flex-col bg-testingColorGrey border-r shadow-md ">
        {/* Sidebar Header */}
        <div className={`p-4 pb-2 pt-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-4`}>
          {!isCollapsed && (
            <>
              <img className="w-[50px] h-[50px]" src="/UTampa_mark.png" alt="Logo" />
              <h1 className="text-xl font-bold text-white">CIRT</h1>
            </>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none ml-auto bg-testingColorHover">
            {isCollapsed ? <FaChevronCircleRight size={24} /> : <FaChevronCircleLeft size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col p-4 pt-0 list-none space-y-3">
          {links.map(({ link, label, icon }) => (
            <li key={label}>
              <Link
                to={link}
                className={`py-2 px-4 flex items-center rounded-lg transition-all duration-300 ${pathname === link ? "bg-cirtGrey text-white" : "bg-opacity-60 text-white hover:bg-cirtGrey hover:bg-opacity-100"} ${!isCollapsed ? "justify-start" : "justify-center"}`}
              >
                <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-start"}`}>
                  <span className="text-xl">{icon}</span>
                  <span className={`ml-3 text-lg font-medium transition-all duration-200 ${isCollapsed ? "ml-0 opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100 w-auto"}`}>
                    {label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          
          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="py-2 px-4 flex items-center rounded-lg transition-all duration-300 text-white hover:bg-cirtGrey hover:bg-opacity-100 mt-auto"
            >
              <span className="text-xl"><FaSignOutAlt size={20} /></span>
              <span className={`ml-3 text-lg font-medium ${isCollapsed ? "ml-0 opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100 w-auto"}`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
