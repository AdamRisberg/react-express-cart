import React from "react";
import { withRouter } from "react-router-dom";

import NavItem from "../NavItem/NavItem";
import CartIcon from "../../../shared-components/icons/CartIcon/CartIcon";

import styles from "./AccountNav.module.css";

const AccountNav = props => {
  if (props.loadingUser) return null;

  if (!props.user) {
    return (
      <div>
        <nav className={styles.AccountNav}>
          <NavItem clickHandler={props.showLogin} name="Sign In" />
          <NavItem clickHandler={props.showRegister} name="Create Account" />
          <button
            className={styles.CartButton}
            onClick={() => props.history.push("/checkout/cart")}
          >
            <CartIcon />
            {`View Cart${props.cartSize ? ` (${props.cartSize})` : ""}`}
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div>
      <nav className={styles.AccountNav}>
        <NavItem
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
        />
        <button
          className={styles.CartButton}
          onClick={() => props.history.push("/checkout/cart")}
        >
          <CartIcon />
          {`View Cart${props.cartSize ? ` (${props.cartSize})` : ""}`}
        </button>
      </nav>
    </div>
  );
};

export default withRouter(AccountNav);
