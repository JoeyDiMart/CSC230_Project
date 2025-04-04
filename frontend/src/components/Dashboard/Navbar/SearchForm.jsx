import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchForm = () => {
  return (
    <form className="flex items-center">
      <div className="flex">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border rounded-l-md"
        />
        <button type="submit" className="bg-primary px-4 py-2 rounded-r-md">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
