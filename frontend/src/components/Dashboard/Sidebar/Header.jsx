import React from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className={`p-4 pb-2 pt-4 flex items-center gap-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
      {!isCollapsed && (
       <Link to="/"> <img className="w-8 h-8" src="/UTampa_mark.png" alt="Logo" /> </Link> 
      )}
      <button onClick={toggleSidebar} className="text-testingColorSidebar focus:outline-none ml-auto  bg-transparent text-lg">
        {isCollapsed ? (<FaChevronCircleRight  />) : (<FaChevronCircleLeft  />)}
      </button>
    </div>
  );
};

export default Header;
