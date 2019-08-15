import React from "react";
import { Link } from "react-router-dom";

import ImageLoader from "../../shared-components/ImageLoader/ImageLoader";

import styles from "./CategoryPreview.module.css";

const CategoryPreview = ({ category }) => {
  return (
    <div className={styles.CategoryPreview}>
      <Link className={styles.CategoryLink} to={`/category/${category.path}`}>
        <div className={styles.Content}>
          <ImageLoader
            path="/images/categories/medium/"
            imageName={category.image}
            alt={category.name}
          />
          <span className={styles.Title}>{category.name}</span>
        </div>
      </Link>
    </div>
  );
};

export default CategoryPreview;
