import React from "react";

import styles from "./ProductInfo.module.css";

const ProductInfo = ({ name, model, price }) => {
  return (
    <div className={styles.ProductInfo}>
      <h1 className={styles.ProductName}>{name}</h1>
      <div className={styles.Model}>Model: {model}</div>
      <div className={styles.Price}>${price.toFixed(2)}</div>
    </div>
  );
};

export default ProductInfo;