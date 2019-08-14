import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import api from "../../api";
import { Helmet } from "react-helmet-async";
import { StripeProvider, Elements } from "react-stripe-elements";

import Login from "../Login/Login";
import AddressForm from "../Addresses/AddressForm/AddressForm";
import Spinner from "../Spinner/Spinner";
import OrderSummary from "../OrderSummary/OrderSummary";
import ShippingOptions from "../ShippingOptions/ShippingOptions";
import CheckoutProgress from "./CheckoutProgress/CheckoutProgress";
import Title from "../Title/Title";
import Button from "../Button/Button";
import PaymentForm from "./PaymentForm/PaymentForm";

import styles from "./Checkout.module.css";

class Checkout extends Component {
  state = {
    isRegister: false,
    showCheckout: false,
    sameAsBilling: true,
    step: 1,
    billingAddress: null,
    shippingAddress: null,
    shippingMethod: "",
    shippingPrice: 0,
    orderID: "",
    shippingID: "",
    mobileSize: false
  };

  componentDidMount() {
    this.loadDefaultAddress();
    this.updateWindowSize();
    window.addEventListener("resize", this.updateWindowSize);
  }

  componentWillUnmount() {
    this.cancelPostRequest && this.cancelPostRequest.cancel();
    window.removeEventListener("resize", this.updateWindowSize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.addresses && !prevProps.user.addresses) {
      this.loadDefaultAddress();
    }
  }

  updateWindowSize = () => {
    const width = window.innerWidth;
    if (width <= 600 && !this.state.mobileSize) {
      this.setState(() => ({ mobileSize: true }));
    } else if (width > 600 && this.state.mobileSize) {
      this.setState(() => ({ mobileSize: false }));
    }
  };

  loadDefaultAddress() {
    const addresses = this.props.user.addresses;

    if (addresses && addresses.length) {
      let defaultAddress;

      for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].default) {
          defaultAddress = { ...addresses[i] };
        }
      }

      if (!defaultAddress) {
        defaultAddress = { ...addresses[0] };
      }
      defaultAddress.email = this.props.user.email;

      this.setState(() => ({ billingAddress: defaultAddress }));
    }
  }

  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true });
  };

  onLoginClick = () => {
    this.setState({ isRegister: false });
  };

  onRegisterClick = () => {
    this.setState({ isRegister: true });
  };

  onGuestContinue = () => {
    this.setState({ showCheckout: true });
  };

  onNextStep = formData => {
    const stateChange = {
      step: this.state.step + 1
    };

    switch (this.state.step) {
      case 1:
        stateChange.billingAddress = formData;
        if (this.state.sameAsBilling) {
          stateChange.shippingAddress = { ...formData };
          stateChange.step++;
        }
        break;
      case 2:
        stateChange.shippingAddress = formData;
        break;
      default:
        break;
    }
    this.setState(() => ({ ...stateChange }));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  onPreviousStep = e => {
    if (e && e.preventDefault) e.preventDefault();
    this.setState(() => ({ step: this.state.step - 1 }));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  onBackToCart = e => {
    if (e && e.preventDefault) e.preventDefault();
    this.props.history.push("/checkout/cart");
  };

  onShippingChange = (id, shippingMethod, price) => () => {
    this.setState(() => ({
      shippingMethod,
      shippingPrice: price,
      shippingID: id
    }));
  };

  renderSignIn() {
    return (
      <div>
        <div className={`${styles.Column50} ${styles.BorderRight}`}>
          <Login
            isRegister={this.state.isRegister}
            leftTitle={true}
            showLogin={this.onLoginClick}
            showRegister={this.onRegisterClick}
            onLogin={this.props.onLogin}
            onRegister={this.props.onRegister}
          />
        </div>
        <div className={styles.Column50}>
          <div className={styles.Left}>
            <Title text="Checkout as Guest" underline />
          </div>
          <p className={styles.GuestMessage}>
            Continue to checkout without an account.
          </p>
          <Button
            text="Continue"
            onClick={this.onGuestContinue}
            buttonStyle="Submit"
            size="Wide"
            bold
          />
        </div>
      </div>
    );
  }

  handleCheckboxChange = e => {
    this.setState({ sameAsBilling: e.target.checked });
  };

  handleCheckout = (stripe, name, onError) => {
    let errMessage;

    stripe
      .createToken({
        name,
        address_line1: this.state.billingAddress.address1,
        address_line2: this.state.billingAddress.address2,
        address_city: this.state.billingAddress.city,
        address_state: this.state.billingAddress.state,
        address_zip: this.state.billingAddress.zip,
        address_country: "US"
      })
      .then(response => {
        if (response.error) {
          errMessage = response.error.message;
          throw new Error();
        }

        const token = response.token;
        const cardInfo = token.card.brand + " - " + token.card.last4;

        const order = {
          email: this.state.billingAddress.email,
          billingAddress: this.state.billingAddress,
          shippingAddress: this.state.shippingAddress,
          cartID: this.props.cartID,
          userID: this.props.user.id,
          paymentMethod: cardInfo,
          shippingMethod: this.state.shippingMethod,
          ipAddress: token.card.client_ip,
          tokenID: token.id,
          shippingID: this.state.shippingID
        };

        this.cancelPostRequest = api.getCancelTokenSource();

        api
          .post(
            "/api/checkout",
            order,
            { cancelToken: this.cancelPostRequest.token },
            false,
            false
          )
          .then(response => {
            if (response.data.success) {
              this.props.clearCart();
              this.setState(() => ({
                step: 5,
                orderID: response.data.orderID
              }));
            }
          })
          .catch(err => {
            if (!api.checkCancel(err)) {
              errMessage = err.response.data;
            }
            throw new Error();
          });
      })
      .catch(() => {
        console.log("Error creating payment request.");
        onError(errMessage || "Something went wrong. Please try again later.");
      });
  };

  renderCheckoutForm() {
    switch (this.state.step) {
      case 1:
        return (
          <AddressForm
            key="billing"
            title="Billing Address"
            cancelButtonText="Back"
            submitButtonText="Continue"
            handleOnSubmit={this.onNextStep}
            handleCancel={this.onBackToCart}
            includeEmail
            address={this.state.billingAddress}
            renderExtras={() => (
              <label className={styles.CheckBoxLabel}>
                Same as shipping
                <input
                  type="checkbox"
                  onChange={this.handleCheckboxChange}
                  checked={this.state.sameAsBilling}
                />
              </label>
            )}
          />
        );
      case 2:
        return (
          <AddressForm
            key="shipping"
            title="Shipping Address"
            cancelButtonText="Back"
            submitButtonText="Continue"
            handleOnSubmit={this.onNextStep}
            handleCancel={this.onPreviousStep}
            address={this.state.shippingAddress}
          />
        );
      case 3:
        return (
          <ShippingOptions
            updateShipping={this.updateShipping}
            handleCancel={this.onPreviousStep}
            onNextStep={this.onNextStep}
            onShippingChange={this.onShippingChange}
            shippingAddress={this.state.shippingAddress}
            shippingMethod={this.state.shippingMethod}
          />
        );
      case 4:
        return (
          <PaymentForm
            handleCancel={this.onPreviousStep}
            onPlaceOrder={this.onPlaceOrder}
            handleCheckout={this.handleCheckout}
            mobileSize={this.state.mobileSize}
            renderSummary={() =>
              this.state.mobileSize ? (
                <OrderSummary
                  cart={this.props.cart}
                  shippingMethod={this.state.shippingMethod}
                  shippingPrice={this.state.shippingPrice}
                  onlyTotals={false}
                />
              ) : null
            }
          />
        );
      default:
        return null;
    }
  }

  render() {
    if (this.state.step === 5) {
      return (
        <Redirect
          to={{
            pathname: "/checkout/success",
            state: {
              email: this.state.billingAddress.email,
              orderID: this.state.orderID
            }
          }}
        />
      );
    }

    if (!this.props.cart.length) {
      return <Redirect to="/checkout/cart" />;
    }

    if (!this.props.scriptLoaded) {
      return <Spinner />;
    }

    return (
      <StripeProvider apiKey="pk_test_PgOiGjiWdLJpOnrUhXkO33qa">
        <div className={styles.Checkout}>
          <Helmet>
            <title>{`Checkout - ${this.props.storeName}`}</title>
          </Helmet>
          {!this.props.loggedIn && !this.state.showCheckout ? (
            this.renderSignIn()
          ) : (
            <Elements>
              <div className={styles.Content}>
                <div className={styles.ColumnLeft}>
                  <CheckoutProgress currentStep={this.state.step} />
                  <div className={styles.FormBox}>
                    {this.renderCheckoutForm()}
                  </div>
                </div>
                {!this.state.mobileSize ? (
                  <div className={styles.ColumnRight}>
                    <OrderSummary
                      showTitle={true}
                      cart={this.props.cart}
                      shippingMethod={this.state.shippingMethod}
                      shippingPrice={this.state.shippingPrice}
                    />
                  </div>
                ) : null}
              </div>
            </Elements>
          )}
        </div>
      </StripeProvider>
    );
  }
}

export default Checkout;
