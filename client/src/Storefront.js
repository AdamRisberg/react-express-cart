import "es6-promise/auto";
import "es6-object-assign/auto";

import React, { Component, lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import api from "./api";
import { HelmetProvider } from "react-helmet-async";
import { connect } from "react-redux";
import { fetchCart } from "./redux/cart/cart-actions";
import { fetchSettings } from "./redux/settings/settings.actions";
import { fetchCategories } from "./redux/categories/categories-actions";
import { fetchUser } from "./redux/user/user-actions";

import Header from "./storefront-components/Header/Header";
import Footer from "./storefront-components/Footer/Footer";
import Category from "./storefront-components/Category/Category";
import Products from "./storefront-components/Products/Products";
import LoginWithModal from "./storefront-components/LoginWithModal/LoginWithModal";
import Home from "./storefront-components/Home/Home";
import SideNav from "./storefront-components/SideNav/SideNav";
import CartAdded from "./storefront-components/CartAdded/CartAdded";
import Spinner from "./shared-components/Spinner/Spinner";

import styles from "./Storefront.module.css";

const Checkout = lazy(() =>
  import("./storefront-components/Checkout/Checkout")
);
const Cart = lazy(() => import("./storefront-components/Cart/Cart"));
const Product = lazy(() => import("./storefront-components/Product/Product"));
const Addresses = lazy(() =>
  import("./storefront-components/Addresses/Addresses")
);
const Orders = lazy(() => import("./storefront-components/Orders/Orders"));
const Order = lazy(() => import("./storefront-components/Order/Order"));
const Page = lazy(() => import("./storefront-components/Page/Page"));
const Success = lazy(() =>
  import("./storefront-components/Checkout/Success/Success")
);
const Profile = lazy(() => import("./storefront-components/Profile/Profile"));

class Storefront extends Component {
  state = {
    showLogin: false,
    showSideNav: false,
    isRegister: false,
    scriptLoaded: false
  };

  cancelTokens = {};

  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchCategories();
    this.props.fetchUser();
    this.props.fetchCart();
  }

  componentWillUnmount() {
    this.cancelTokens &&
      Object.keys(this.cancelTokens).forEach(requestKey => {
        this.cancelTokens[requestKey].cancel();
      });
  }

  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true });
  };

  addAddress = address => {
    this.cancelTokens.addressPostRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/addresses",
        { id: this.state.user.id, address },
        { cancelToken: this.cancelTokens.addressPostRequest.token },
        true,
        false
      )
      .then(response => {
        this.setState(() => ({ user: response.data }));
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  editAddress = (addressID, address) => {
    this.cancelTokens.addressPutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/addresses",
        { id: this.state.user.id, address, addressID },
        { cancelToken: this.cancelTokens.addressPutRequest.token },
        true,
        false
      )
      .then(response => {
        this.setState(() => ({ user: response.data }));
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  deleteAddress = addressID => {
    this.cancelTokens.deleteAddressRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/addresses/remove",
        { id: this.state.user.id, addressID },
        { cancelToken: this.cancelTokens.deleteAddressRequest.token },
        true,
        false
      )
      .then(response => {
        this.setState(() => ({ user: response.data }));
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  onHamburgerClick = () => {
    this.setState({ showSideNav: true });
  };

  closeSideNav = () => {
    this.setState({ showSideNav: false });
  };

  render() {
    return (
      <div className={styles.Page}>
        <Header onHamburgerClick={this.onHamburgerClick} />
        <div className={styles.MainBody}>
          <div className={styles.Content}>
            <HelmetProvider>
              <Suspense fallback={<Spinner />}>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/product/:id" component={Product} />
                  <Route path="/category/:any" component={Category} />
                  <Route path="/search" component={Products} />
                  <Route path="/checkout/cart" component={Cart} />
                  <Route path="/checkout/success" component={Success} />
                  <Route path="/checkout" component={Checkout} />
                  <Route exact path="/account" component={Profile} />
                  <Route path="/account/orders" component={Orders} />
                  <Route
                    exact
                    path="/account/addresses"
                    render={props => (
                      <Addresses
                        {...props}
                        addAddress={this.addAddress}
                        editAddress={this.editAddress}
                        deleteAddress={this.deleteAddress}
                      />
                    )}
                  />
                  <Route path="/account/order/:id" component={Order} />
                  <Route path="/:page" component={Page} />
                </Switch>
              </Suspense>
            </HelmetProvider>
            <LoginWithModal />
            <CartAdded />
          </div>
        </div>
        <Footer />
        <SideNav
          show={this.state.showSideNav}
          closeSideNav={this.closeSideNav}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart()),
  fetchSettings: () => dispatch(fetchSettings()),
  fetchCategories: () => dispatch(fetchCategories()),
  fetchUser: () => dispatch(fetchUser())
});

export default connect(
  null,
  mapDispatchToProps
)(Storefront);
