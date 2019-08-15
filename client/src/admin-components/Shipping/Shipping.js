import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import styles from "./Shipping.module.css";

class Shipping extends Component {
  state = {
    selected: {},
    allSelected: false,
    refresh: false
  };

  componentWillUnmount() {
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
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
        "/api/shipping/delete",
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

  handleAdd = () => {
    this.cancelPostRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/shipping/",
        {},
        { cancelToken: this.cancelPostRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/shipping/" + res.data);
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleEdit = id => () => {
    this.props.history.push("/admin/shipping/" + id);
  };

  render() {
    return (
      <WithPagination
        isAdmin={true}
        flashErrorMessage={this.props.flashErrorMessage}
        fetchUrl="/api/shipping?page="
        fetchUseSession
        fetchAdmin
        refresh={this.state.refresh}
        renderTitle={() => (
          <div className={styles.TitleBox}>
            SHIPPING
            <Button type="add" onClick={this.handleAdd} />
            <Button type="delete" onClick={this.handleDelete} />
          </div>
        )}
        renderItems={shipping => (
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
                <th className={styles.CollapseLarge}>Label</th>
                <th className={styles.CollapseSmall}>Price</th>
                <th className={styles.Collapse}>Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shipping.map(method => {
                return (
                  <tr key={method._id}>
                    <td>
                      <Checkbox
                        handleSelect={this.handleSelect}
                        isChecked={this.state.selected[method._id]}
                        id={method._id}
                      />
                    </td>
                    <td>{method.name}</td>
                    <td className={styles.CollapseLarge}>{method.label}</td>
                    <td className={styles.CollapseSmall}>
                      ${method.price.toFixed(2)}
                    </td>
                    <td className={styles.Collapse}>
                      {method.active ? "Yes" : "No"}
                    </td>
                    <td>
                      <Button
                        type="edit"
                        onClick={this.handleEdit(method._id)}
                      />
                    </td>
                  </tr>
                );
              })}
              {!shipping.length ? (
                <tr>
                  <td colSpan={6}>No shipping methods found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      />
    );
  }
}

export default Shipping;
