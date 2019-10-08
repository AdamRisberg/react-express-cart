import React from "react";
import { withRouter } from "react-router-dom";

import NavItem from "../NavItem/NavItem";
import CartIcon from "../../../shared-components/icons/CartIcon/CartIcon";

import AccountDropdown from "../AccountDropdown/AccountDropdown";

import styles from "./AccountNav.module.css";

const AccountNav = props => {
  if (props.loadingUser) return null;

  if (!props.user) {
    return (
      <nav className={styles.AccountNav}>
        <NavItem clickHandler={props.showLogin} name="Sign In" />
        <NavItem clickHandler={props.showRegister} name="Create Account" />
        <button
          className={styles.CartButton}
          onClick={() => props.history.push("/checkout/cart")}
        >
          <CartIcon />
          <span className={styles.CartLabel}>View Cart (</span>
          {props.cartSize && props.cartSize}
          <span className={styles.CartLabel}>)</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className={styles.AccountNav}>
      {/* <NavItem
        clickHandler={() => {}}
        name={`${props.user.firstName} ${props.user.lastName}`}
        prefix={"/account"}
        subcategories={[
          { _id: "0", path: "", name: "Account" },
          { _id: "1", path: "orders", name: "Orders" },
          { _id: "2", path: "addresses", name: "Addresses" },
          {
            _id: "3",
            path: "logout",
            name: "Sign Out",
            clickHandler: props.logout
          }
        ]}
      /> */}
      <AccountDropdown
        text={`${props.user.firstName} ${props.user.lastName}`}
        logout={props.logout}
      />
      <button
        className={styles.CartButton}
        onClick={() => props.history.push("/checkout/cart")}
      >
        <CartIcon />
        <span className={styles.CartLabel}>View Cart (</span>
        {props.cartSize && props.cartSize}
        <span className={styles.CartLabel}>)</span>
      </button>
    </nav>
  );
};

export default withRouter(AccountNav);
