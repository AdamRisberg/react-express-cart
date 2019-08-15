import React from "react";

import styles from "./ItemValueEdit.module.css";

const ItemValueEdit = ({ item, value, onChange, type, className }) => {
  return (
    <label className={`${styles.ItemValue} ${className}`}>
      {item}:
      <input
        type={type}
        onChange={onChange}
        className={styles.Value}
        value={value}
      />
    </label>
  );
};

export default ItemValueEdit;
