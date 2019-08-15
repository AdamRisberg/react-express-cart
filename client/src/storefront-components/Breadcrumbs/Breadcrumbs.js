import React from "react";
import { withRouter, Link } from "react-router-dom";

import styles from "./Breadcrumbs.module.css";

const Breadcrumbs = props => {
  return (
    <div className={styles.BreadCrumbsRow}>
      <div className={styles.BreadCrumbs}>
        <Link className={styles.Link} to="/">
          Home
        </Link>
        <span className={styles.Arrow}>></span>
        {renderBreadCrumbs(props)}
      </div>
    </div>
  );
};

function renderBreadCrumbs(props) {
  return props.pathname
    .split("/")
    .map((loc, i, arr) => (
      <React.Fragment key={i + loc}>
        {i !== arr.length - 1 ? (
          createBreadCrumb(i, arr, props)
        ) : (
          <span className={styles.Last}>
            {props.isProduct
              ? loc
              : getNameFromPath(arr.slice(0, i + 1).join("/"), props)}
          </span>
        )}
      </React.Fragment>
    ));
}

function createBreadCrumb(i, arr, props) {
  return (
    <React.Fragment>
      <Link
        className={i === arr.length - 1 ? styles.Last : styles.Link}
        to={"/category/" + arr.slice(0, i + 1).join("/")}
      >
        {getNameFromPath(arr.slice(0, i + 1).join("/"), props)}
      </Link>
      <span className={styles.Arrow}>></span>
    </React.Fragment>
  );
}

function getNameFromPath(path, props) {
  const categories = props.categories;

  function search(query, cats = categories) {
    if (!cats) return;

    for (let i = 0; i < cats.length; i++) {
      if (cats[i].path === query) return cats[i].name;
      let found = search(query, cats[i].subcategories);
      if (found) return found;
    }
  }
  return search(path);
}

export default withRouter(Breadcrumbs);
