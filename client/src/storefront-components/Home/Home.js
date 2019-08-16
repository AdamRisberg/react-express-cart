import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";

import Category from "../Category/Category";

import styles from "./Home.module.css";

const Home = ({
  metaTitle,
  metaDescription,
  storeName,
  loadingCategories,
  ...props
}) => {
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
};

const mapStateToProps = ({ settings, categories }) => ({
  metaTitle: settings.meta_title,
  metaDescription: settings.meta_description,
  storeName: settings.store_name,
  categories: categories.categories,
  loadingCategories: categories.loadingCategories
});

export default connect(mapStateToProps)(Home);
