import React from "react";
import "./Search.css";

interface SearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default Search;
