import React, { Component } from "react";
import api from "../../api";

import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import { formatDateShort, handleAdminRequestErrorFull } from "../../utils";

import styles from "./Customers.module.css";

class Customers extends Component {
  state = {
    selected: {},
    allSelected: false,
    refresh: false
  };

  componentWillUnmount() {
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
  }

  handleSelect = e => {
    const id = e.target.id;
    const checked = e.target.checked;

    this.setState(() => ({
      selected: { ...this.state.selected, [id]: checked }
    }));
  };

  handleSelectAll = e => {
    const allSelected = e.target.checked;
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const selected = {};

    checkboxes.forEach(box => {
      if (box.id && box.id !== "ALL") {
        selected[box.id] = allSelected;
      }
    });
    this.setState(() => ({ selected, allSelected }));
  };

  handleDelete = () => {
    this.cancelDeleteRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/customers/delete",
        Object.keys(this.state.selected),
        { cancelToken: this.cancelDeleteRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ refresh: !this.state.refresh }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleEdit = id => () => {
    this.props.history.push("/admin/customer/" + id);
  };

  render() {
    return (
      <WithPagination
        isAdmin={true}
        flashErrorMessage={this.props.flashErrorMessage}
        fetchUrl="/api/customers?page="
        fetchUseSession
        fetchAdmin
        refresh={this.state.refresh}
        renderTitle={() => (
          <div className={styles.TitleBox}>
            CUSTOMERS
            <Button type="delete" onClick={this.handleDelete} />
          </div>
        )}
        renderItems={customers => (
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    handleSelect={this.handleSelectAll}
                    isChecked={this.state.allSelected}
                    id="ALL"
                  />
                </th>
                <th>Name</th>
                <th className={styles.CollapseLarge}>Email</th>
                <th className={styles.CollapseSmall}>Date Added</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <Checkbox
                      handleSelect={this.handleSelect}
                      isChecked={this.state.selected[customer._id]}
                      id={customer._id}
                    />
                  </td>
                  <td>
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className={styles.CollapseLarge}>{customer.email}</td>
                  <td className={styles.CollapseSmall}>
                    {formatDateShort(customer.dateAdded)}
                  </td>
                  <td>
                    <Button
                      type="edit"
                      onClick={this.handleEdit(customer._id)}
                    />
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

export default Customers;
