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
    <ul className="flex flex-col p-2 pt-0 list-none space-y-3">
      {links.map(({ link, label, icon }) => (
        <li key={label}>
          <Link to={link} 
          className={` flex items-center p-4 pb-2 pt-4 gap-4 rounded-lg transition-all duration-300 
            ${pathname === link ? "bg-testingColorHover text-white" : "bg-opacity-60 text-white hover:bg-testingColorHover hover:bg-opacity-100"} ${!isCollapsed ? "justify-start" : "justify-center"}`}>
            <div className={`flex w-full ${isCollapsed ? "justify-right" : "justify-start"}`}>
              <span className="text-lg justify-center">{icon}</span>
              <span className={`ml-3 text-[16px] whitespace-nowrap
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
