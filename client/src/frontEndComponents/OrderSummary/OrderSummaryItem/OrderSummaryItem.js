import React from "react";

import styles from "./OrderSummaryItem.module.css";

const OrderSummaryItem = ({ item, noUnderline }) => {
  return (
    <div className={`${styles.Row} ${noUnderline ? "" : styles.Underline}`} key={item._id}>
      <div className={styles.ItemTitle}>{item.name}</div>
      <div className={styles.Options}>
        {item.options.map((option, i) => (
          <React.Fragment key={option.optionID}>
            <span>{option.name}: </span>
            <span>{option.value}{item.options.length-1 === i ? "" : ", "}</span>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.LeftColumn}>Qty: {item.quantity}</div>
      <div className={styles.RightColumn}>${item.price.toFixed(2, 10)}</div>
    </div>
  );
};

export default OrderSummaryItem;