import React from "react";
import { Link } from "react-router-dom";

import OrderTotals from "../../shared-components/OrderTotals/OrderTotals";
import OrderSummaryItem from "./OrderSummaryItem/OrderSummaryItem";

import styles from "./OrderSummary.module.css";

const OrderSummary = ({ shippingPrice, cart, shippingMethod, showTitle }) => {
  const subtotal = cart.reduce((acc, item) => {
    const price = acc + item.price * item.quantity;
    return parseFloat(price.toFixed(2), 10);
  }, 0);

  let total = subtotal + shippingPrice;
  total = parseFloat(total.toFixed(2), 10);

  return (
    <div className={showTitle ? styles.OrderSummary : styles.NoTitle}>
      {showTitle ? (
        <div className={styles.Title}>
          Order Summary
          <div className={styles.EditCart}>
            <Link to="/checkout/cart">Edit Cart</Link>
          </div>
        </div>
      ) : null}
      <div className={showTitle ? styles.Content : ""}>
        {cart.map(item => (
          <OrderSummaryItem key={item._id} item={item} />
        ))}
        <OrderTotals
          spread={true}
          shipping={shippingPrice}
          showShipping={!!shippingMethod.length}
          subtotal={subtotal}
          total={total}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
