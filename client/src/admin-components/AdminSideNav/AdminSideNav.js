import React, { Component } from "react";
import { Link } from "react-router-dom";

import styles from "./AdminSideNav.module.css";

class AdminSideNav extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          className={`${styles.SideNav} ${this.props.show ? styles.Open : ""}`}
          onClick={this.props.onCloseClick}
        />
        <div className={styles.SideNavContent}>
          <div className={styles.CloseButton} onClick={this.props.onCloseClick}>
            &times;
          </div>
          <div className={styles.Brand}>ReactExpressCart</div>
          {this.props.categories.map(cat => (
            <Link
              key={cat.name}
              onClick={this.props.onCloseClick}
              className={styles.NavLink}
              to={"/admin" + cat.path}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default AdminSideNav;
