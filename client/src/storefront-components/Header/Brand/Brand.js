import React from "react";
import { Link } from "react-router-dom";

import ImageLoader from "../../../shared-components/ImageLoader/ImageLoader";

import styles from "./Brand.module.css";

const Brand = ({ settings }) => {
  return (
    <div className={styles.Brand}>
      <Link to="/" className={styles.BrandText}>
        {settings.brand_image ? (
          <ImageLoader
            imageName={settings.brand_image}
            alt={settings.store_name}
            path="/images/general/medium/"
          />
        ) : (
          settings.store_name
        )}
      </Link>
    </div>
  );
};

export default Brand;
