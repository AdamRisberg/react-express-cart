import React from "react";
import Helmet from "react-helmet";

import CartItem from "./CartItem/CartItem";
import Title from "../Title/Title";
import Button from "../Button/Button";

import styles from "./Cart.module.css";

const Cart = (props) => {
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
            key={item.id + item.optionsKey}
            removeFromCart={props.removeFromCart}
            updateCart={props.updateCart}
            {...item}
          />
        );
      })}
      {props.cart.length > 0 ? (
        <React.Fragment>
          <div className={styles.LeftColumn}>
            {`Subtotal (${itemCount} item${itemCount > 1 ? "s" : ""}): $${total}`}
          </div>
          <div className={styles.RightColumn}>
            <Button text="Proceed to Checkout" onClick={() => props.history.push("/checkout")} buttonStyle="Submit" size="WideOnMobile" noMargin bold />
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

export default Cart;