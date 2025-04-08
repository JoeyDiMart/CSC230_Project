import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchForm = () => {
  return (
    <form className="flex items-center">
      <div className="flex">
        <input type="text" placeholder="Search Publication" className="w-48 border-solid rounded-md bg-transparent"/>
        <button type="submit" className="bg-transparent">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
