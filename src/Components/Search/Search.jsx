// src/Search/Search.jsx
import React from "react";
import "./Search.css";

const Search = ({ searchTerm, onSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar por nombre o tipo..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default Search;
