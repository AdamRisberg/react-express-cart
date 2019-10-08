import React from "react";
import { Link } from "react-router-dom";

import styles from "./NavItem.module.css";

const NavItem = props => {
  const hasSubs = props.subcategories && props.subcategories.length;

  return (
    <li className={hasSubs ? styles.NavItemWithSubs : styles.NavItem}>
      {props.clickHandler ? (
        // <span tabIndex={0} onClick={props.clickHandler}>
        //   {props.name}
        // </span>
        <button onClick={props.clickHandler}>{props.name}</button>
      ) : (
        <Link to={`${props.prefix}/${props.path}`}>{props.name}</Link>
      )}
      {hasSubs
        ? renderSubcategories(props.subcategories, props.right, props.prefix)
        : null}
    </li>
  );
};

function renderSubcategories(cats, right, prefix) {
  return (
    <React.Fragment>
      <div className={right ? styles.SubBoxRight : styles.SubBox}>
        {cats.map(cat => {
          const hasSubs = cat.subcategories && cat.subcategories.length;

          return (
            <React.Fragment key={cat._id}>
              <div
                className={hasSubs ? styles.SubItemWithSubs : styles.SubItem}
              >
                {cat.clickHandler ? (
                  <span
                    onClick={cat.clickHandler}
                    className={styles.SubItemLink}
                  >
                    {cat.name}
                  </span>
                ) : (
                  <Link
                    to={`${prefix}/${cat.path}`}
                    className={styles.SubItemLink}
                  >
                    {cat.name}
                  </Link>
                )}
                {hasSubs
                  ? renderSecondLevel(cat.subcategories, right, prefix)
                  : null}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className={styles.UpArrow} />
    </React.Fragment>
  );
}

function renderSecondLevel(cats, right, prefix) {
  return (
    <React.Fragment>
      <span className={styles.RightArrow} />
      <div
        className={right ? styles.SecondLevelBoxRight : styles.SecondLevelBox}
      >
        {cats.map(cat => {
          return (
            <div className={styles.SubItem} key={cat._id}>
              {cat.clickHandler ? (
                <span onClick={cat.clickHandler} className={styles.SubItemLink}>
                  {cat.name}
                </span>
              ) : (
                <Link
                  to={`${prefix}/${cat.path}`}
                  className={styles.SubItemLink}
                >
                  {cat.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default NavItem;
