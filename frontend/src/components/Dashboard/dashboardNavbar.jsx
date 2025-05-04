import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import SearchForm from "./Navbar/searchForm";

const Navbar = () => {
  return (
    <div className="w-full">
      <nav className="flex items-center justify-between p-4 bg-transparent" >
        <div>
            <SearchForm />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
