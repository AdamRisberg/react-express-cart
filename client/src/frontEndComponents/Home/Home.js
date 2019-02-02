import React from "react";
import Helmet from "react-helmet";

import Category from "../Category/Category";

import styles from "./Home.module.css";

const Home = ({ metaTitle, metaDescription, storeName, loadingCategories, ...props }) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <h1 className={styles.Title}>Welcome to {storeName}!</h1>
      {loadingCategories ? null : <Category {...props} isHome={true} />}
    </React.Fragment>
  );
}

export default Home;