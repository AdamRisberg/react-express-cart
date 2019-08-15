import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils";

import OrderPreviewItem from "../../../shared-components/OrderPreviewItem/OrderPreviewItem";
import Button from "../../Button/Button";

import styles from "./OrderPreview.module.css";

const OrderPreview = props => {
  return (
    <div className={styles.OrderPreview}>
      <div className={styles.ClearFix}>
        <div className={`${styles.LeftColumn} ${styles.SmallMarginBottom}`}>
          <span className={styles.Bold}>Date: </span>
          {formatDate(props.date)}
        </div>
        <div className={`${styles.RightColumn} ${styles.SmallMarginBottom}`}>
          <span className={styles.Bold}>Order #: </span>
          {props.orderNumber}
        </div>
      </div>
      <div className={styles.SmallMarginBottom}>
        <span className={styles.Bold}>Status: </span>
        {props.status}
      </div>
      <div className={styles.SmallMarginBottom}>
        <span className={styles.Bold}>Total: </span>${props.total.toFixed(2)}
      </div>
      <div className={styles.OrderItemsBox}>
        {props.items.map(item => {
          return <OrderPreviewItem key={item._id} {...item} />;
        })}
      </div>
      <div className={styles.Bottom}>
        <Link to={`/account/order/${props._id}`}>
          <Button
            text="View Order Details"
            buttonStyle="Submit"
            bold
            noMargin
          />
        </Link>
      </div>
    </div>
  );
};

export default OrderPreview;
