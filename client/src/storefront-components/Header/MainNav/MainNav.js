import React from "react";

import HamburgerIcon from "../../../shared-components/icons/HamburgerIcon/HamburgerIcon";

import styles from "./MainNav.module.css";

const MainNav = props => {
  return (
    <div className={styles.MainNav}>
      <button onClick={props.onHamburgerClick}>
        <HamburgerIcon />
      </button>
    </div>
  );
};

// function renderMenuItems(items) {
//   return items.map(cat => {
//     return <NavItem key={cat._id} {...cat} prefix="/category" />;
//   });
// }

export default MainNav;
