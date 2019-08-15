import React from "react";
import { formatDate } from "../../utils";

import OrderPreviewItem from "../../shared-components/OrderPreviewItem/OrderPreviewItem";
import Address from "../../shared-components/Address/Address";
import OrderTotals from "../OrderTotals/OrderTotals";
import Title from "../Title/Title";

import styles from "./OrderView.module.css";

const OrderView = ({ order, style = {} }) => {
  const { billingAddress, shippingAddress } = order;

  const trackingNums = [];
  order.history
    .map(status => status.tracking)
    .forEach(tracking => trackingNums.push(...tracking));

  return (
    <div style={style} className={styles.Order}>
      <Title text={`Order #: ${order.orderNumber}`} underline centerOnMobile />
      <div className={styles.ClearFix}>
        <div className={styles.LeftColumn}>
          <div className={styles.SmallMarginBottom}>
            <span className={styles.Bold}>Date: </span>
            {formatDate(order.date)}
          </div>
          <div className={styles.SmallMarginBottom}>
            <span className={styles.Bold}>Status: </span>
            {order.status}
          </div>
          <div className={styles.SmallMarginBottom}>
            <span className={styles.Bold}>Tracking Number(s): </span>
            {trackingNums.length
              ? trackingNums.map((tracking, i) => (
                  <div key={tracking + i}>{tracking}</div>
                ))
              : "Not Available"}
          </div>
        </div>
        <div className={styles.RightColumn}>
          <div className={styles.SmallMarginBottom}>
            <span className={styles.Bold}>Payment Method: </span>
            {order.paymentMethod}
          </div>
          <div className={styles.SmallMarginBottom}>
            <span className={styles.Bold}>Shipping Method: </span>
            {order.shippingMethod}
          </div>
        </div>
      </div>
      <div className={styles.ClearFix}>
        <div className={`${styles.LeftColumn} ${styles.SmallMarginBottom}`}>
          <Address address={billingAddress} title="Billing Address" />
        </div>
        <div className={`${styles.RightColumn} ${styles.SmallMarginBottom}`}>
          <Address address={shippingAddress} title="Shipping Address" />
        </div>
      </div>
      <div className={styles.OrderItemsBox}>
        {order.items &&
          order.items.map(item => {
            return <OrderPreviewItem key={item._id} {...item} />;
          })}
      </div>
      <OrderTotals
        showShipping={true}
        shipping={order.shipping}
        subtotal={order.subtotal}
        total={order.total}
      />
    </div>
  );
};

export default OrderView;
