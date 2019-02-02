import React, { Component } from "react";
import api from "../../api";

import WithPagination from "../../frontEndComponents/WithPagination/WithPagination";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import { formatDateShort, handleAdminRequestErrorFull } from "../../utils";

import styles from "./Orders.module.css";


class Orders extends Component {
  state = {
    selected: {},
    allSelected: false,
    refresh: false
  };

  componentWillUnmount() {
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
  }

  handleSelect = (e) => {
    const id = e.target.id;
    const checked = e.target.checked;

    this.setState(() => ({
      selected: {...this.state.selected, [id]: checked }
    }));
  };

  handleSelectAll = (e) => {
    const allSelected = e.target.checked;
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const selected = {};

    checkboxes.forEach(box => {
      if(box.id && box.id !== "ALL") {
        selected[box.id] = allSelected;
      }
    });
    this.setState(() => ({ selected, allSelected }));
  };

  handleDelete = () => {
    this.cancelDeleteRequest = api.getCancelTokenSource();

    api
      .post("/api/orders/delete", Object.keys(this.state.selected), { cancelToken: this.cancelDeleteRequest.token }, true, true)
      .then(res => {
        this.setState(() => ({ refresh: !this.state.refresh }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleEdit = (id) => () => {
    this.props.history.push("/admin/order/" + id);
  };

  render() {
    return (
      <WithPagination
        isAdmin={true}
        flashErrorMessage={this.props.flashErrorMessage}
        fetchUrl="/api/orders/all?page="
        fetchUseSession
        fetchAdmin
        refresh={this.state.refresh}
        renderTitle={() => (
          <div className={styles.TitleBox}>
            ORDERS
            <Button type="delete" onClick={this.handleDelete} />
          </div>
        )}
        renderItems={orders => (
          <table className={styles.Table}>
            <thead>
              <tr>
                <th><Checkbox handleSelect={this.handleSelectAll} isChecked={this.state.allSelected} id="ALL" /></th>
                <th>Order #</th>
                <th className={styles.CollapseMedium}>Customer</th>
                <th className={styles.CollapseMedium}>Status</th>
                <th className={styles.CollapseLarge}>Total</th>
                <th className={styles.CollapseSmall}>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td><Checkbox handleSelect={this.handleSelect} isChecked={this.state.selected[order._id]} id={order._id} /></td>
                  <td>{order.orderNumber}</td>
                  <td className={styles.CollapseMedium}>{`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}</td>
                  <td className={styles.CollapseMedium}>{order.status}</td>
                  <td className={styles.CollapseLarge}>${order.total.toFixed(2)}</td>
                  <td className={styles.CollapseSmall}>{formatDateShort(order.date)}</td>
                  <td>
                    <Button type="view" onClick={this.handleEdit(order._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />
    );
  }
}

export default Orders;