import React from "react";
import { connect } from "react-redux";
import { closeCartAdded } from "../../redux/cart/cart-actions";

import Modal from "../Modal/Modal";
import OrderSummaryItem from "../OrderSummary/OrderSummaryItem/OrderSummaryItem";
import Button from "../Button/Button";
import Title from "../../shared-components/Title/Title";

import styles from "./CartAdded.module.css";

const CartAdded = ({ showCartAdded, cartItem, closeCartAdded }) => {
  if (!showCartAdded) return null;

  return (
    <Modal
      close={closeCartAdded}
      renderContent={close => (
        <div className={styles.CartAdded}>
          <Title text="Item Added To Cart" underline center />
          <OrderSummaryItem item={cartItem} noUnderline />
          <Button
            onClick={close}
            text="Continue Shopping"
            size="Wide"
            buttonStyle="Continue"
            bold
          />
          <Button
            onClick={() => close("/checkout")}
            text="Checkout"
            size="Wide"
            buttonStyle="Submit"
            bold
          />
        </div>
      )}
    />
  );
};

const mapStateToProps = ({ cart }) => {
  return {
    showCartAdded: cart.showCartAdded,
    cartItem: cart.cartItemAdded
  };
};

const mapDispatchToProps = dispatch => ({
  closeCartAdded: () => dispatch(closeCartAdded())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartAdded);
