import React, { Component } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  injectStripe
} from "react-stripe-elements";

import Spinner from "../../../shared-components/Spinner/Spinner";
import Title from "../../../shared-components/Title/Title";
import Button from "../../Button/Button";

import styles from "./PaymentForm.module.css";

class PaymentForm extends Component {
  state = {
    name: "",
    ready: 0,
    numberClass: styles.CardItem,
    expiryClass: styles.CardItem,
    cvvClass: styles.CardItem,
    errorMessage: "",
    buttonDisabled: false
  };

  handleNameChange = e => {
    const name = e.target.value;
    this.setState(() => ({ name }));
  };

  onError = message => {
    this.setState({ errorMessage: message, buttonDisabled: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState(() => ({ buttonDisabled: true }));

    this.props.handleCheckout(this.props.stripe, this.state.name, this.onError);
  };

  onReady = () => {
    this.setState(() => ({ ready: this.state.ready + 1 }));
  };

  onFocus = name => {
    this.setState({ [name]: `${styles.CardItem} ${styles.Focused}` });
  };

  onBlur = name => {
    this.setState({ [name]: styles.CardItem });
  };

  render() {
    const cardStyle = {
      base: {
        fontSize: "16px",
        fontFamily: "inherit"
      }
    };

    return (
      <div>
        <Title text="Payment Method" underline />
        <div className={styles.DemoMessage}>
          This is only a demo. No cards will actually be charged. To finish
          testing the checkout process, use 4242-4242-4242-4242 for the card
          number, any name, any valid expiration date, and any CVV.
        </div>
        <div className={styles.Form}>
          <form
            className={this.state.ready !== 3 ? styles.Hide : ""}
            onSubmit={this.handleSubmit}
          >
            {this.props.renderSummary ? this.props.renderSummary() : null}
            <label className={styles.Label} htmlFor="name">
              Name on Card
              <input
                id="name"
                onChange={this.handleNameChange}
                value={this.state.name}
                className={styles.CardItem}
              />
            </label>
            <div>
              <label className={styles.Label} htmlFor="number">
                Card Number
                <CardNumberElement
                  onFocus={() => this.onFocus("numberClass")}
                  onBlur={() => this.onBlur("numberClass")}
                  placeholder=""
                  id="number"
                  className={this.state.numberClass}
                  onReady={this.onReady}
                  style={cardStyle}
                />
              </label>
              <div className={styles.BottomDiv}>
                <label className={styles.Label} htmlFor="expiry">
                  Expiration Date
                  <CardExpiryElement
                    onFocus={() => this.onFocus("expiryClass")}
                    onBlur={() => this.onBlur("expiryClass")}
                    id="expiry"
                    className={this.state.expiryClass}
                    onReady={this.onReady}
                    style={cardStyle}
                  />
                </label>
                <label className={styles.Label} htmlFor="cvc">
                  CVV
                  <CardCvcElement
                    onFocus={() => this.onFocus("cvvClass")}
                    onBlur={() => this.onBlur("cvvClass")}
                    placeholder=""
                    id="cvc"
                    className={this.state.cvvClass}
                    onReady={this.onReady}
                    style={cardStyle}
                  />
                </label>
              </div>
              {this.state.errorMessage ? (
                <div className={styles.Error}>{this.state.errorMessage}</div>
              ) : null}
              <Button
                text="Back"
                onClick={this.props.handleCancel}
                buttonStyle="Cancel"
                bold
              />
              <Button
                buttonStyle="Submit"
                disabled={this.state.buttonDisabled}
                type="submit"
                bold
                float="Right"
                text={
                  this.state.buttonDisabled ? (
                    <React.Fragment>
                      <Spinner style={{ fontSize: "1rem" }} />
                      <span className={styles.LoadingText}>Processing...</span>
                    </React.Fragment>
                  ) : (
                    "Place Order"
                  )
                }
              />
            </div>
          </form>
          {this.state.ready !== 3 ? <Spinner /> : null}
        </div>
      </div>
    );
  }
}

export default injectStripe(PaymentForm);
