import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";

import { updateItem, removeItem } from "../../redux/cart/cart-actions";

import CartItem from "./CartItem/CartItem";
import Title from "../../shared-components/Title/Title";
import Button from "../Button/Button";
import Spinner from "../../shared-components/Spinner/Spinner";

import styles from "./Cart.module.css";

const Cart = props => {
  if (props.loadingCart) return <Spinner />;

  const itemCount = countItems(props);
  const total = calculateTotal(props);

  return (
    <div>
      <Helmet>
        <title>{`Your Cart - ${props.storeName}`}</title>
      </Helmet>
      <Title text="Your Cart" underline centerOnMobile />
      {props.cart.map(item => {
        return (
          <CartItem
            key={item._id + item.optionsKey}
            removeFromCart={props.removeFromCart}
            updateCart={props.updateCart}
            {...item}
          />
        );
      })}
      {props.cart.length > 0 ? (
        <React.Fragment>
          <div className={styles.LeftColumn}>
            {`Subtotal (${itemCount} item${
              itemCount > 1 ? "s" : ""
            }): $${total}`}
          </div>
          <div className={styles.RightColumn}>
            <Button
              text="Proceed to Checkout"
              onClick={() => props.history.push("/checkout")}
              buttonStyle="Submit"
              size="WideOnMobile"
              noMargin
              bold
            />
          </div>
        </React.Fragment>
      ) : (
        <div>Your shopping cart is empty.</div>
      )}
    </div>
  );
};

function calculateTotal(props) {
  const total = props.cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  return total.toFixed(2);
}

function countItems(props) {
  return props.cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
}

const mapStateToProps = ({ cart, settings }) => {
  return {
    cart: cart.cartItems,
    loadingCart: cart.loadingCart,
    storeName: settings.store_name
  };
};

const mapDispatchToProps = dispatch => ({
  updateCart: (id, optionsKey, quantity) =>
    dispatch(updateItem(id, optionsKey, quantity)),
  removeFromCart: (id, optionsKey) => dispatch(removeItem(id, optionsKey))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
