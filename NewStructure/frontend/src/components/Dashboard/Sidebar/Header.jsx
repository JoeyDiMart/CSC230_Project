import React from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const Header = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className={`p-4 pb-2 pt-4 flex items-center gap-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
      {!isCollapsed && (
        <img className="w-8 h-8" src="/UTampa_mark.png" alt="Logo" />
      )}
      <button onClick={toggleSidebar} className="text-testingColorSidebar focus:outline-none ml-auto  bg-transparent">
        {isCollapsed ? (<FaChevronCircleRight size={20} />) : (<FaChevronCircleLeft size={16} />)}
      </button>
    </div>
  );
};

export default Header;
