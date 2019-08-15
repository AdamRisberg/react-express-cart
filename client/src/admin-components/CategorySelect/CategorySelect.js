import React from "react";

import styles from "./CategorySelect.module.css";

const CategorySelect = ({ categories, onChange, value }) => {
  return (
    <select
      id="category-select"
      className={styles.CategorySelect}
      onChange={onChange}
      value={value}
    >
      <option value="">NONE</option>
      {categories.map(cat => (
        <option key={cat._id} data-path={cat.path} value={cat._id}>
          {String.fromCharCode(8194).repeat(cat.level) + cat.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
