import React, { Component } from "react";
import MainNav from "./MainNav/MainNav";
import AccountNav from "./AccountNav/AccountNav";
import SearchBox from "./SearchBox/SearchBox";
import Brand from "./Brand/Brand";

import styles from "./Header.module.css";

class Header extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.HeaderRow}>
            <Brand settings={this.props.settings} />
            <AccountNav
              loggedIn={this.props.loggedIn}
              loadingUser={this.props.loadingUser}
              user={this.props.user}
              onLogout={this.props.onLogout}
              showLogin={this.props.showLogin}
              showRegister={this.props.showRegister}
              cartSize={this.props.cartSize}
            />
          </div>
          <div className={styles.HeaderRow}>
            <MainNav
              categories={this.props.categories}
              onHamburgerClick={this.props.onHamburgerClick}
            />
            <SearchBox />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Header;
