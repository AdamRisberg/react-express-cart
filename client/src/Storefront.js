import React, { Component, lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
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
import SideNavWithModal from "./storefront-components/SideNavWithModal/SideNavWithModal";
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
  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchCategories();
    this.props.fetchUser();
    this.props.fetchCart();
  }

  render() {
    return (
      <div className={styles.Page}>
        <Header />
        <div className={styles.MainBody}>
          <div className={styles.Content}>
            <HelmetProvider>
              <Suspense fallback={<Spinner />}>
                <Switch>
                  <Redirect exact from="/account/logout" to="/" />
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
                    component={Addresses}
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
        <SideNavWithModal />
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
