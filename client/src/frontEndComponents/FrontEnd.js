import "es6-promise/auto";
import "es6-object-assign/auto";

import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import api from "../api";
import scriptLoader from "react-async-script";

import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Category from "./Category/Category";
import Products from "./Products/Products";
import Login from "./Login/Login";
import Home from "./Home/Home";
import SideNav from "./SideNav/SideNav";
import Modal from "./Modal/Modal";
import CartAdded from "./CartAdded/CartAdded";
import Spinner from "./Spinner/Spinner";

import styles from "./FrontEnd.module.css";

const Checkout = lazy(() => import("./Checkout/Checkout"));
const Cart = lazy(() => import ("./Cart/Cart"));
const Product = lazy(() => import ("./Product/Product"));
const Addresses = lazy(() => import ("./Addresses/Addresses"));
const Orders = lazy(() => import ("./Orders/Orders"));
const Order = lazy(() => import ("./Order/Order"));
const Page = lazy(() => import ("./Page/Page"));
const Success = lazy(() => import ("./Checkout/Success/Success"));
const Profile = lazy(() => import("./Profile/Profile"));

const CheckoutWithScript = scriptLoader("https://js.stripe.com/v3/")(Checkout);

class FrontEnd extends Component {
  state = {
    showLogin: false,
    showSideNav: false,
    isRegister: false,
    categories: null,
    cart: [],
    cartID: "",
    loggedIn: false,
    user: {},
    loadingUser: true,
    loadingCart: true,
    loadingCategories: true,
    scriptLoaded: false,
    showCartAdded: false,
    cartItemAdded: null,
    settings: {}
  };

  componentDidMount() {
    const token = window.localStorage.getItem("session");
    const cartID = window.localStorage.getItem("cartSession");

    this.cancelGetCatsRequest = api.getCancelTokenSource();
    this.cancelGetSettingsRequest = api.getCancelTokenSource();

    Promise.all([
      api.get("/api/categories", { cancelToken: this.cancelGetCatsRequest.token }, false, false),
      api.get("/api/settings/general", { cancelToken: this.cancelGetSettingsRequest.token }, false, false)
    ])
      .then(([cats, settings]) => {
        this.setState({
          categories: cats.data,
          loadingCategories: false,
          settings: settings.data
        });
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err);
      });

    if(token) {
      this.cancelTokenLoginRequest = api.getCancelTokenSource();

      api.post("/api/auth/login", {}, { cancelToken: this.cancelTokenLoginRequest.token }, true, false)
        .then(response => {
          window.localStorage.setItem("session", response.data.token);
          this.setState(() => ({ loggedIn: true, user: response.data.user, loadingUser: false }));
        })
        .catch(err => {
          if(api.checkCancel(err)) {
            return;
          }
          window.localStorage.removeItem("session");
          this.setState(() => ({ loadingUser: false, loggedIn: false }));
          console.log(err.response);
        });
    } else {
      this.setState(() => ({ loadingUser: false, loggedIn: false }));
    }

    if(cartID) {
      this.cancelGetCartRequest = api.getCancelTokenSource();

      api.get("/api/cart/" + cartID, { cancelToken: this.cancelGetCartRequest.token }, false, false)
        .then(response => {
          window.localStorage.setItem("cartSession", response.data.cartID);
          this.setState(() => ({ 
            cartID: response.data.cartID,
            cart: response.data.cart,
            loadingCart: false 
          }));
        })
        .catch(err => {
          if(api.checkCancel(err)) {
            return;
          }
          window.localStorage.removeItem("cartSession");
          this.setState(() => ({ loadingCart: false }))
          console.log(err.response);
        });
    } else {
      this.setState(() => ({ loadingCart: false }));
    }
  }

  componentWillUnmount() {
    this.cancelAddCartPostRequest && this.cancelAddCartPostRequest.cancel();
    this.cancelAddressPostRequest && this.cancelAddressPostRequest.cancel();
    this.cancelAddressPutRequest && this.cancelAddressPutRequest.cancel();
    this.cancelClearCartRequest && this.cancelClearCartRequest.cancel();
    this.cancelDeleteAddressRequest && this.cancelDeleteAddressRequest.cancel();
    this.cancelGetCartRequest && this.cancelGetCartRequest.cancel();
    this.cancelGetCatsRequest && this.cancelGetCatsRequest.cancel();
    this.cancelGetSettingsRequest && this.cancelGetSettingsRequest.cancel();
    this.cancelLoginRequest && this.cancelLoginRequest.cancel();
    this.cancelLogoutRequest && this.cancelLogoutRequest.cancel();
    this.cancelRegisterRequest && this.cancelRegisterRequest.cancel();
    this.cancelRemoveCartRequest && this.cancelRemoveCartRequest.cancel();
    this.cancelTokenLoginRequest && this.cancelTokenLoginRequest.cancel();
  }

  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true });
  };

  refreshUser = (user) => {
    this.setState(() => ({ user }));
  };

  addAddress = (address) => {
    this.cancelAddressPostRequest = api.getCancelTokenSource();

    api.post("/api/addresses", { id: this.state.user.id, address }, { cancelToken: this.cancelAddressPostRequest.token }, true, false)
      .then(response => {
        this.setState(() => ({ user: response.data }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  editAddress = (addressID, address) => {
    this.cancelAddressPutRequest = api.getCancelTokenSource();

    api.put("/api/addresses", { id: this.state.user.id, address, addressID }, { cancelToken: this.cancelAddressPutRequest.token }, true, false)
      .then(response => {
        this.setState(() => ({ user: response.data }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  deleteAddress = (addressID) => {
    this.cancelDeleteAddressRequest = api.getCancelTokenSource();

    api.post("/api/addresses/remove", { id: this.state.user.id, addressID }, { cancelToken: this.cancelDeleteAddressRequest.token }, true, false)
      .then(response => {
        this.setState(() => ({ user: response.data }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  addToCart = (add, update) => {
    this.cancelAddCartPostRequest = api.getCancelTokenSource();

    api.post("/api/cart/add", { cartID: this.state.cartID, cartItem: add }, { cancelToken: this.cancelAddCartPostRequest.token }, false, false)
      .then(response => {
        window.localStorage.setItem("cartSession", response.data.cartID);
        this.setState(() => ({
          cartID: response.data.cartID,
          cart: response.data.cart,
          showCartAdded: !update,
          cartItemAdded: !update ? add : null
        }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  closeCartAdded = () => {
    this.setState(() => ({ showCartAdded: false, cartItemAdded: null }));
  };

  removeFromCart = (id, optionsKey) => {
    this.cancelRemoveCartRequest = api.getCancelTokenSource();

    api.post("/api/cart/remove", { cartID: this.state.cartID, id, optionsKey }, { cancelToken: this.cancelRemoveCartRequest.token }, false, false)
      .then(response => {
        this.setState(() => ({ cart: response.data }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  };

  clearCart = () => {
    this.cancelClearCartRequest = api.getCancelTokenSource();

    api.post("/api/cart/clear", { cartID: this.state.cartID }, { cancelToken: this.cancelClearCartRequest.token }, false, false)
      .then(response => {
        this.setState(() => ({ cart: response.data }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        window.localStorage.removeItem("cartSession");
        console.log(err.response);
      });
  };

  updateCart = (id, optionsKey, quantity) => {
    const cart = this.state.cart;
    let cartItem;

    for(let i = 0; i < cart.length; i++) {
      if(cart[i].productID === id && cart[i].optionsKey === optionsKey) {
        cartItem = cart[i];
        break;
      }
    }

    const quantityChange = quantity - cartItem.quantity;
    cartItem.quantity = quantityChange;

    this.addToCart(cartItem, true);
  };

  getCartSize() {
    return this.state.cart.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0)
  }

  showLogin = (e) => {
    if(e) e.preventDefault();
    this.setState({ showLogin: true, isRegister: false });
  };

  showRegister = (e) => {
    if(e) e.preventDefault();
    this.setState({ showLogin: true, isRegister: true });
  }

  onHamburgerClick = () => {
    this.setState({ showSideNav: true });
  };

  closeLogin = () => {
    this.setState({ showLogin: false });
  };
  
  closeSideNav = () => {
    this.setState({ showSideNav: false });
  };

  onLogin = (formData, cb, errorCb) => {
    this.cancelLoginRequest = api.getCancelTokenSource();

    api.post("/api/auth/login", formData, { cancelToken: this.cancelLoginRequest.token }, false, false)
      .then(response => {
        window.localStorage.setItem("session", response.data.token);
        this.setState(() => ({ loggedIn: true, showLogin: false, user: response.data.user }));
        if(cb) cb();
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        if(errorCb) errorCb();
        console.log(err.response);
      });
  };

  onRegister = (formData, cb, errorCb) => {
    this.cancelRegisterRequest = api.getCancelTokenSource();

    api.post("/api/auth/register", formData, { cancelToken: this.cancelRegisterRequest.token }, false, false)
      .then(response => {
        window.localStorage.setItem("session", response.data.token);
        this.setState(() => ({ loggedIn: true, showLogin: false, user: response.data.user }));
        if(cb) cb();
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        if(errorCb) errorCb();
        console.log(err.response);
      });
  };

  onLogout = (e) => {
    if(e && e.preventDefault) e.preventDefault();
    this.cancelLogoutRequest = api.getCancelTokenSource();

    
    api.get("/api/auth/logout", { cancelToken: this.cancelLogoutRequest.token }, true, false)
      .then(() => this.logout())
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log("Error on logout")
      });
  };

  logout() {
    window.localStorage.removeItem("session");
    this.setState(() => ({ loggedIn: false, user: {} }));
  }

  renderLogin() {
    return (
      <Login
        isRegister={this.state.isRegister}
        showRegister={this.showRegister}
        showLogin={this.showLogin}
        closeLogin={this.closeLogin}
        onLogin={this.onLogin}
        onRegister={this.onRegister}
      />
    );
  }

  render() {
    return (
      <div className={styles.Page}>
        <Header
          loggedIn={this.state.loggedIn}
          onLogout={this.onLogout}
          loadingUser={this.state.loadingUser}
          user={this.state.user}
          showLogin={this.showLogin}
          showRegister={this.showRegister}
          categories={this.state.categories}
          onHamburgerClick={this.onHamburgerClick}
          cartSize={this.getCartSize()}
          settings={this.state.settings}
        />
        <div className={styles.MainBody}>
          <div className={styles.Content}>
            <Suspense fallback={<Spinner />}>
              <Switch>
                <Route path="/" exact render={(props) => (
                  <Home
                    {...props}
                    storeName={this.state.settings.store_name}
                    metaTitle={this.state.settings.meta_title}
                    metaDescription={this.state.settings.meta_description}
                    categories={this.state.categories}
                    loadingCategories={this.state.loadingCategories}
                  />
                )} />
                <Route path="/product/:id" render={(props) => (
                  <Product
                    {...props}
                    storeName={this.state.settings.store_name}
                    categories={this.state.categories}
                    addToCart={this.addToCart}
                  />
                )} />
                <Route path="/category/:any" render={(props) => (
                  this.state.loadingCategories ? null :
                  <Category
                    {...props}
                    storeName={this.state.settings.store_name}
                    categories={this.state.categories}
                  />
                )} />
                <Route path="/search" render={props => (
                  <Products {...props} isSearch={true} />
                )} />
                <Route path="/checkout/cart" render={(props) => (
                  this.state.loadingCart ? null :
                  <Cart
                    {...props}
                    storeName={this.state.settings.store_name}
                    updateCart={this.updateCart}
                    removeFromCart={this.removeFromCart}
                    cart={this.state.cart}
                  />
                )} />
                <Route path="/checkout/success" render={props => (
                  <Success {...props} storeName={this.state.settings.store_name} />
                )} />
                <Route path="/checkout" render={(props) => (
                  this.state.loadingUser || this.state.loadingCart ? null :
                  <CheckoutWithScript
                    {...props}
                    storeName={this.state.settings.store_name}
                    asyncScriptOnLoad={this.handleScriptLoad}
                    clearCart={this.clearCart}
                    loggedIn={this.state.loggedIn}
                    onLogin={this.onLogin}
                    onRegister={this.onRegister}
                    cart={this.state.cart}
                    cartID={this.state.cartID}
                    user={this.state.user}
                    scriptLoaded={this.state.scriptLoaded}
                  />
                )} />
                <Route exact path="/account" render={(props) => (
                  this.state.loadingUser ? null :
                  <Profile
                    {...props}
                    storeName={this.state.settings.store_name}
                    refreshUser={this.refreshUser}
                    user={this.state.user}
                  />
                )} />
                <Route path="/account/orders" render={(props) => (
                  this.state.loadingUser ? null : 
                  <Orders
                    {...props}
                    storeName={this.state.settings.store_name}
                    userID={this.state.user.id}
                    loggedIn={this.state.loggedIn}
                  />
                )} />
                <Route exact path="/account/addresses" render={(props) => (
                  this.state.loadingUser ? null :
                  <Addresses
                    {...props}
                    storeName={this.state.settings.store_name}
                    addAddress={this.addAddress}
                    editAddress={this.editAddress}
                    deleteAddress={this.deleteAddress}
                    user={this.state.user}
                    loggedIn={this.state.loggedIn}
                  />
                )} />
                <Route path="/account/order/:id" render={(props) => (
                  this.state.loadingUser ? null :
                  <Order
                    {...props}
                    storeName={this.state.settings.store_name}
                    loggedIn={this.state.loggedIn}
                    user={this.state.user}
                  />
                )} />
                <Route path="/:page" render={props => <Page {...props} storeName={this.state.settings.store_name} />} />    
              </Switch>
            </Suspense>
            {!this.state.showLogin ? null : (
              <Modal close={this.closeLogin}>
                <Login
                  isRegister={this.state.isRegister}
                  showRegister={this.showRegister}
                  showLogin={this.showLogin}
                  closeLogin={this.closeLogin}
                  onLogin={this.onLogin}
                  onRegister={this.onRegister}
                />
              </Modal>
            )}
            {!this.state.showCartAdded ? null : (
              <Modal close={this.closeCartAdded} renderContent={(close) => (
                <CartAdded cartItem={this.state.cartItemAdded} close={close} />
              )} />
            )}
          </div>
        </div>
        <Footer />
        <SideNav
          loggedIn={this.state.loggedIn}
          onLogout={this.onLogout}
          categories={this.state.categories}
          show={this.state.showSideNav}
          closeSideNav={this.closeSideNav}
          showLogin={this.showLogin}
          showRegister={this.showRegister}
          storeName={this.state.settings.store_name}
        />
      </div>
    );
  }
}

export default FrontEnd;