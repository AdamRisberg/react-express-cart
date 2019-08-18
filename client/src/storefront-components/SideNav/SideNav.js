import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { showLogin, showRegister, logout } from "../../redux/user/user-actions";
import { hideSideNav } from "../../redux/ui/ui-actions";

import ArrowIcon from "../../shared-components/icons/ArrowIcon/ArrowIcon";

import styles from "./SideNav.module.css";

class SideNav extends Component {
  state = {
    left: [],
    center: "home",
    cats: {},
    loading: true
  };

  componentDidUpdate() {
    if (!this.props.loadingCategories && this.state.loading) {
      const catLookup = this.createCatLookup();
      this.setState({ cats: catLookup, loading: false });
    }
  }

  onMenuItemClick = idx => {
    const previous = this.state.center;
    const left = [...this.state.left, previous];
    this.setState(() => ({ left: left, center: idx }));
  };

  onBackClick = () => {
    const nextLeft = this.state.left[this.state.left.length - 1];
    const newLeft = this.state.left.slice(0, this.state.left.length - 1);
    this.setState(() => ({ left: newLeft, center: nextLeft }));
  };

  onLinkClick = () => {
    this.props.closeSideNav();
    setTimeout(() => {
      this.setState({ left: "", center: "home" });
    }, 200);
  };

  onClickParent = e => {
    if (e.target === e.currentTarget) {
      this.closeNav();
    }
  };

  closeNav = () => {
    this.props.closeSideNav();

    setTimeout(() => {
      this.setState({ left: "", center: "home" });
    }, 200);
  };

  onAccountClick = cb => {
    this.closeNav();
    cb();
  };

  renderTopNav(key, title) {
    if (key === "home") {
      return (
        <React.Fragment>
          <div className={styles.NavTitle}>ACCOUNT</div>
          <ul className={styles.Nav}>
            {this.props.loggedIn ? (
              <React.Fragment>
                <Link
                  className={styles.NavLink}
                  to="/account/orders"
                  onClick={this.onLinkClick}
                >
                  Orders
                </Link>
                <Link
                  className={styles.NavLink}
                  to="/account/addresses"
                  onClick={this.onLinkClick}
                >
                  Addresses
                </Link>
                <li
                  className={styles.NavLink}
                  onClick={() => this.onAccountClick(this.props.logout)}
                >
                  Sign Out
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li
                  className={styles.NavLink}
                  onClick={() => this.onAccountClick(this.props.showLogin)}
                >
                  Sign In
                </li>
                <li
                  className={styles.NavLink}
                  onClick={() => this.onAccountClick(this.props.showRegister)}
                >
                  Create Account
                </li>
              </React.Fragment>
            )}
          </ul>
          <div className={styles.Line} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className={styles.BackButton} onClick={this.onBackClick}>
          <ArrowIcon direction="left" />
          {title}
        </div>
        <div className={styles.Line} />
      </React.Fragment>
    );
  }

  renderCategories() {
    const cats = this.state.cats;

    if (!cats) return null;

    const keys = Object.keys(cats);

    return keys.map((key, i) => {
      let position =
        this.state.left.indexOf(key) !== -1
          ? "Left"
          : key === this.state.center
          ? "Center"
          : "Right";
      const prev =
        cats[this.state.left[this.state.left.length - 1]] &&
        cats[this.state.left[this.state.left.length - 1]].title;

      return (
        <div
          key={key + i}
          className={`${styles.SlideContent} ${styles[position]}`}
        >
          {this.renderTopNav(
            key,
            prev !== "SHOP BY CATEGORY" ? prev : "MAIN MENU"
          )}
          <div className={styles.NavTitle}>{cats[key].title}</div>
          <ul className={styles.Nav}>
            {cats[key].categories.map(cat =>
              cat.subcategories ? (
                <li
                  key={cat.id}
                  className={styles.NavItem}
                  onClick={() => this.onMenuItemClick(cat.id)}
                >
                  {cat.name}
                </li>
              ) : (
                <li key={cat.id}>
                  <Link
                    className={styles.NavLink}
                    to={`/category/${cat.path}`}
                    onClick={this.onLinkClick}
                  >
                    {cat.name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      );
    });
  }

  createCatLookup(
    cats = this.props.categories,
    result = {},
    parent = "home",
    title = "SHOP BY CATEGORY"
  ) {
    const catArray = [];

    cats.forEach(cat => {
      catArray.push({
        id: cat._id,
        name: cat.name,
        path: cat.path,
        subcategories: cat.subcategories.length
      });
      this.createCatLookup(cat.subcategories, result, cat._id, cat.name);
    });
    result[parent] = {
      title: title,
      categories: catArray
    };

    return result;
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={`${styles.SideNav} ${this.props.show ? styles.Open : ""}`}
          onClick={this.onClickParent}
        />
        <div className={styles.SideNavContent}>
          <div className={styles.CloseButton} onClick={this.closeNav}>
            &times;
          </div>
          <div className={styles.Brand}>{this.props.storeName}</div>
          {this.renderCategories()}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings, categories, user, ui }) => ({
  storeName: settings.store_name,
  categories: categories.categories,
  loadingCategories: categories.loadingCategories,
  loggedIn: !!user.user,
  show: ui.showSideNav
});

const mapDispatchToProps = dispatch => ({
  showLogin: () => dispatch(showLogin()),
  showRegister: () => dispatch(showRegister()),
  logout: () => dispatch(logout()),
  closeSideNav: () => dispatch(hideSideNav())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNav);
