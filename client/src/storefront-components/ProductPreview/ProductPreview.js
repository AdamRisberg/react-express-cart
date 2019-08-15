import React from "react";
import { Link } from "react-router-dom";

import ImageLoader from "../../shared-components/ImageLoader/ImageLoader";

import styles from "./ProductPreview.module.css";

const ProductPreview = ({ product }) => {
  const image = product.images[0] || {};

  return (
    <div className={styles.ProductPreview}>
      <Link className={styles.ProductLink} to={`/product/${product._id}`}>
        <ImageLoader
          imageName={image.src}
          path="/images/products/medium/"
          alt={image.alt}
        />
        <div className={styles.Content}>
          <div className={styles.Title}>{product.name}</div>
          <div className={styles.Price}>${product.price.toFixed(2)}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProductPreview;
