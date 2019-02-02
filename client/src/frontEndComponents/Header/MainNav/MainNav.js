import React from "react";

import NavItem from "../NavItem/NavItem";
import HamburgerIcon from "../../icons/HamburgerIcon/HamburgerIcon";

import styles from "./MainNav.module.css";

const MainNav = (props) => {
  return (
    <nav className={styles.MainNav}>
      {renderMenuItems(props.categories || [])}
      <HamburgerIcon onHamburgerClick={props.onHamburgerClick} />
    </nav>
  );
};

function renderMenuItems(items) {
  return items.map(cat => {
    return <NavItem key={cat._id} {...cat} prefix="/category" />
  });
}

export default MainNav;