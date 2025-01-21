import React from 'react';

const Filters = ({ categories, selectedCategory, onCategoryChange, searchTerm, onSearchChange }) => {
  return (
    <div>
      <div>
        <label>Category: </label>
        <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)}>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
