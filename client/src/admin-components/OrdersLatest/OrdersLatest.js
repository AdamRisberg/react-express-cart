import React from "react";

import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Button from "../Button/Button";

import { formatDateShort } from "../../utils";

import styles from "./OrdersLatest.module.css";

const OrdersLatest = ({ history, flashErrorMessage }) => {
  return (
    <WithPagination
      isAdmin={true}
      flashErrorMessage={flashErrorMessage}
      fetchUrl="/api/orders/all?page="
      fetchUseSession
      fetchAdmin
      limit={5}
      disablePagination={true}
      renderTitle={() => <div className={styles.TitleBox}>LATEST ORDERS</div>}
      renderItems={orders => (
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th className={styles.CollapseMedium}>Customer</th>
              <th className={styles.CollapseMedium}>Status</th>
              <th className={styles.CollapseLarge}>Total</th>
              <th className={styles.CollapseSmall}>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td className={styles.CollapseMedium}>{`${
                  order.billingAddress.firstName
                } ${order.billingAddress.lastName}`}</td>
                <td className={styles.CollapseMedium}>{order.status}</td>
                <td className={styles.CollapseLarge}>
                  ${order.total.toFixed(2)}
                </td>
                <td className={styles.CollapseSmall}>
                  {formatDateShort(order.date)}
                </td>
                <td>
                  <Button
                    type="view"
                    onClick={handleEdit(order._id, history)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    />
  );
};

const handleEdit = (id, history) => () => {
  history.push("/admin/order/" + id);
};

export default OrdersLatest;
