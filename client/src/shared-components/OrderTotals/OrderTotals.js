import React from "react";
import styles from "./OrderTotals.module.css";

const OrderTotals = ({ shipping, subtotal, total, showShipping, spread }) => {
  return (
    <div className={styles.Totals}>
      <div className={styles.TotalRightColumn}>
        <div className={styles.SmallMarginBottom}>${subtotal.toFixed(2)}</div>
        {showShipping ? (
          <div className={styles.SmallMarginBottom}>${shipping.toFixed(2)}</div>
        ) : null}
        <div className={`${styles.SmallMarginBottom} ${styles.Bold}`}>
          ${total.toFixed(2)}
        </div>
      </div>
      <div
        className={`${styles.TotalLeftColumn} ${
          spread ? styles.AlignLeft : ""
        }`}
      >
        <div className={`${styles.SmallMarginBottom}`}>Subtotal: </div>
        {showShipping ? (
          <div className={`${styles.SmallMarginBottom}`}>Shipping: </div>
        ) : null}
        <div className={`${styles.SmallMarginBottom} ${styles.Bold}`}>
          Total:{" "}
        </div>
      </div>
    </div>
  );
};

export default OrderTotals;
