import React from "react";

import OrderSummaryItem from "../OrderSummary/OrderSummaryItem/OrderSummaryItem";
import Button from "../Button/Button";
import Title from "../Title/Title";

import styles from "./CartAdded.module.css";

const CartAdded = ({ cartItem, close }) => {
  return (
    <div className={styles.CartAdded}>
      <Title text="Item Added To Cart" underline center />
      <OrderSummaryItem item={cartItem} noUnderline />
      <Button onClick={close} text="Continue Shopping" size="Wide" buttonStyle="Continue" bold />
      <Button onClick={() => close("/checkout")} text="Checkout" size="Wide" buttonStyle="Submit" bold />
    </div>
  );
};

export default CartAdded;