import React, { Component, lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import api from "./api";

import AdminSideNav from "./admin-components/AdminSideNav/AdminSideNav";
import HamburgerIcon from "./shared-components/icons/HamburgerIcon/HamburgerIcon";
import Button from "./admin-components/Button/Button";
import Dashboard from "./admin-components/Dashboard/Dashboard";
import Spinner from "./shared-components/Spinner/Spinner";
import Login from "./shared-components/Login/Login";

import styles from "./Admin.module.css";

const Categories = lazy(() =>
  import("./admin-components/Categories/Categories")
);
const CategoryForm = lazy(() =>
  import("./admin-components/Categories/CategoryForm/CategoryForm")
);
const Products = lazy(() => import("./admin-components/Products/Products"));
const ProductForm = lazy(() =>
  import("./admin-components/ProductForm/ProductForm")
);
const Orders = lazy(() => import("./admin-components/Orders/Orders"));
const OrderForm = lazy(() => import("./admin-components/OrderForm/OrderForm"));
const Pages = lazy(() => import("./admin-components/Pages/Pages"));
const PageForm = lazy(() => import("./admin-components/PageForm/PageForm"));
const Customers = lazy(() => import("./admin-components/Customers/Customers"));
const CustomerForm = lazy(() =>
  import("./admin-components/CustomerForm/CustomerForm")
);
const ShippingForm = lazy(() =>
  import("./admin-components/Shipping/ShippingForm/ShippingForm")
);
const Shipping = lazy(() => import("./admin-components/Shipping/Shipping"));
const AdminAccounts = lazy(() =>
  import("./admin-components/AdminAccounts/AdminAccounts")
);
const AdminAccountForm = lazy(() =>
  import("./admin-components/AdminAccounts/AdminAccountForm/AdminAccountForm")
);
const Settings = lazy(() => import("./admin-components/Settings/Settings"));
const Database = lazy(() => import("./admin-components/Database/Database"));

class Admin extends Component {
  state = {
    user: {},
    settings: {},
    loggedIn: false,
    loadingUser: true,
    showNav: false,
    showErrorFlash: false
  };

  componentDidMount() {
    const token = window.localStorage.getItem("admin-session");

    this.cancelTokenLoginRequest = api.getCancelTokenSource();

    if (token) {
      api
        .post(
          "/api/auth/admin_login",
          {},
          { cancelToken: this.cancelTokenLoginRequest.token },
          true,
          true
        )
        .then(response => {
          window.localStorage.setItem("admin-session", response.data.token);
          this.setState(() => ({
            loggedIn: true,
            user: response.data.user,
            loadingUser: false
          }));
        })
        .catch(err => {
          if (api.checkCancel(err)) {
            return;
          }
          window.localStorage.removeItem("admin-session");
          this.setState(() => ({ loadingUser: false, loggedIn: false }));
          console.log(err.response);
        });
    } else {
      this.setState(() => ({ loadingUser: false, loggedIn: false }));
    }
  }

  componentWillUnmount() {
    this.cancelTokenLoginRequest && this.cancelTokenLoginRequest.cancel();
    this.cancelLoginRequest && this.cancelLoginRequest.cancel();
    this.cancelLogoutRequest && this.cancelLogoutRequest.cancel();
  }

  handleLogin = (formData, cb, errorCb) => {
    this.cancelLoginRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/auth/admin_login",
        formData,
        { cancelToken: this.cancelLoginRequest.token },
        false,
        true
      )
      .then(response => {
        window.localStorage.setItem("admin-session", response.data.token);
        this.setState(() => ({
          loggedIn: true,
          showLogin: false,
          user: response.data.user
        }));
        if (cb) cb();
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        if (errorCb) errorCb();
        console.log(err.response);
      });
  };

  onLogout = e => {
    if (e && e.preventDefault) e.preventDefault();
    if (this.loggingOut) return;

    this.cancelLogoutRequest = api.getCancelTokenSource();
    this.loggingOut = true;

    api
      .get(
        "/api/auth/admin_logout",
        { cancelToken: this.cancelLogoutRequest.token },
        true,
        true
      )
      .then(this.logout)
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        this.logout();
      });
  };

  logout = () => {
    window.localStorage.removeItem("admin-session");
    this.setState(
      () => ({ loggedIn: false, user: {} }),
      () => {
        this.loggingOut = false;
      }
    );
  };

  onHamburgerClick = () => {
    this.setState(() => ({ showNav: true }));
  };

  onCloseClick = () => {
    this.setState(() => ({ showNav: false }));
  };

  flashErrorMessage = shouldLogout => {
    if (shouldLogout) {
      return this.onLogout();
    }

    this.flashTimer && clearTimeout(this.flashTimer);
    this.setState(() => ({ showErrorFlash: true }));

    this.flashTimer = setTimeout(() => {
      this.setState(() => ({ showErrorFlash: false }));
    }, 5000);
  };

  render() {
    const { loggedIn, loadingUser, user } = this.state;

    if (!loggedIn) {
      return (
        <div style={{ backgroundColor: "#eee" }} className={styles.Page}>
          <header
            style={{ fontSize: "1.3rem", padding: "10px 20px" }}
            className={styles.Header}
          >
            ReactExpressCart
          </header>
          <div className={styles.LoginBody}>
            <div className={styles.Login}>
              {!loadingUser ? (
                <Login onLogin={this.handleLogin} hideRegister />
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.Page}>
        <header className={styles.Header}>
          <HamburgerIcon onHamburgerClick={this.onHamburgerClick} />
          <Button type="exit" onClick={this.onLogout} />
          <div className={styles.LoggedInAs}>
            {`${user.firstName} ${user.lastName}`}
          </div>
        </header>
        <div className={styles.MainBody}>
          <div className={styles.Content}>
            <Suspense fallback={<Spinner />}>
              <Switch>
                <Route
                  exact
                  path="/admin"
                  render={props => (
                    <Dashboard
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/categories"
                  render={props => (
                    <Categories
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/category/:id"
                  render={props => (
                    <CategoryForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/products"
                  render={props => (
                    <Products
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/product/:id"
                  render={props => (
                    <ProductForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/product"
                  render={props => (
                    <ProductForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/orders"
                  render={props => (
                    <Orders
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/order/:id"
                  render={props => (
                    <OrderForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/pages"
                  render={props => (
                    <Pages
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/page/:id"
                  render={props => (
                    <PageForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/customers"
                  render={props => (
                    <Customers
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/customer/:id"
                  render={props => (
                    <CustomerForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/shipping/:id"
                  render={props => (
                    <ShippingForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/shipping"
                  render={props => (
                    <Shipping
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/admin_accounts"
                  render={props => (
                    <AdminAccounts
                      {...props}
                      user={this.state.user}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/admin_account/:id"
                  render={props => (
                    <AdminAccountForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/admin_account"
                  render={props => (
                    <AdminAccountForm
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/settings"
                  render={props => (
                    <Settings
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
                <Route
                  path="/admin/database"
                  render={props => (
                    <Database
                      {...props}
                      flashErrorMessage={this.flashErrorMessage}
                    />
                  )}
                />
              </Switch>
            </Suspense>
          </div>
        </div>
        <footer className={styles.Footer}>
          <div className={styles.Column50}>
            {"ReactExpressCart ©" + new Date().getFullYear()}
          </div>
          <div className={`${styles.Column50} ${styles.Right}`}>
            Version 0.1
          </div>
        </footer>
        <AdminSideNav
          onCloseClick={this.onCloseClick}
          show={this.state.showNav}
          categories={categories}
        />
        <div
          className={`${styles.FlashError} ${
            this.state.showErrorFlash ? styles.ShowFlashError : ""
          }`}
        >
          You do not have permission to perform this action.
        </div>
      </div>
    );
  }
}

const categories = [
  {
    name: "Dashboard",
    path: "/"
  },
  {
    name: "Categories",
    path: "/categories"
  },
  {
    name: "Products",
    path: "/products"
  },
  {
    name: "Customers",
    path: "/customers"
  },
  {
    name: "Orders",
    path: "/orders"
  },
  {
    name: "Info Pages",
    path: "/pages"
  },
  {
    name: "Shipping",
    path: "/shipping"
  },
  {
    name: "Admin Accounts",
    path: "/admin_accounts"
  },
  {
    name: "Settings",
    path: "/settings"
  },
  {
    name: "Backup / Restore",
    path: "/database"
  }
];

export default Admin;
