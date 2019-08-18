import React from "react";
import { connect } from "react-redux";

import { showLogin, showRegister, logout } from "../../redux/user/user-actions";
import { showSideNav } from "../../redux/ui/ui-actions";

import MainNav from "./MainNav/MainNav";
import AccountNav from "./AccountNav/AccountNav";
import SearchBox from "./SearchBox/SearchBox";
import Brand from "./Brand/Brand";

import styles from "./Header.module.css";

function Header(props) {
  return (
    <React.Fragment>
      <div className={styles.Header}>
        <div className={styles.HeaderRow}>
          <Brand settings={props.settings} />
          <AccountNav
            loadingUser={props.loadingUser}
            user={props.user}
            logout={props.logout}
            showLogin={props.showLogin}
            showRegister={props.showRegister}
            cartSize={props.cartSize}
          />
        </div>
        <div className={styles.HeaderRow}>
          <MainNav
            categories={props.categories}
            onHamburgerClick={props.onHamburgerClick}
          />
          <SearchBox />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = ({ cart, settings, categories, user }) => ({
  cartSize: cart.cartSize,
  settings,
  categories: categories.categories,
  user: user.user,
  loadingUser: user.loadingUser
});

const mapDispatchToProps = dispatch => ({
  showLogin: () => dispatch(showLogin()),
  showRegister: () => dispatch(showRegister()),
  logout: () => dispatch(logout()),
  onHamburgerClick: () => dispatch(showSideNav())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
