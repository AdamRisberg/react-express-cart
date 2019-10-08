import React from "react";
import { withRouter } from "react-router-dom";

import NavItem from "../NavItem/NavItem";
import CartIcon from "../../../shared-components/icons/CartIcon/CartIcon";

import AccountDropdown from "../AccountDropdown/AccountDropdown";

import styles from "./AccountNav.module.css";

const AccountNav = props => {
  if (props.loadingUser) return null;

  return (
    <nav className={styles.AccountNav}>
      {props.user ? (
        <AccountDropdown
          text={`${props.user.firstName} ${props.user.lastName}`}
          logout={props.logout}
        />
      ) : (
        <React.Fragment>
          <NavItem clickHandler={props.showLogin} name="Sign In" />
          <NavItem clickHandler={props.showRegister} name="Create Account" />
        </React.Fragment>
      )}
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
