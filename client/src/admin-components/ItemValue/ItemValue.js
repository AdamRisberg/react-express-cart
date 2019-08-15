import React from "react";

import styles from "./ItemValue.module.css";

const ItemValue = ({ item, value, className }) => {
  return (
    <div className={`${styles.ItemValue} ${className}`}>
      {item}:<div className={styles.Value}>{value}</div>
    </div>
  );
};

export default ItemValue;
