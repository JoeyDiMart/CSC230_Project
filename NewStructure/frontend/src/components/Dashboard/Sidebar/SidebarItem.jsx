// SidebarItems.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserPlus, FaCamera } from "react-icons/fa";

const links = [
  { link: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
  { link: "/addusers", label: "Add User", icon: <FaUserPlus size={20} /> },
  { link: "/dashboard/photoGalleryUpload", label: "Photo Gallery", icon: <FaCamera size={20} /> },
];

const SidebarItems = ({ isCollapsed }) => {
  const { pathname } = useLocation();

  return (
    <ul className="flex flex-col p-4 pt-0 list-none space-y-3">
      {links.map(({ link, label, icon }) => (
        <li key={label}>
          <Link to={link} 
          className={`py-2 px-4 flex items-center rounded-lg transition-all duration-300 
            ${pathname === link ? "bg-cirtGrey text-white" : "bg-opacity-60 text-white hover:bg-cirtGrey hover:bg-opacity-100"} ${!isCollapsed ? "justify-start" : "justify-center"}`}>
            <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "justify-start"}`}>
              <span className="text-xl">{icon}</span>
              <span className={`ml-3 text-[16px] transition-all duration-200 
                ${isCollapsed ? "overflow-hidden w-0 scale-0 opacity-0" : "opacity-100 scale-95 w-auto"}`}>{label}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarItems;
