import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

import WithPagination from "../../frontEndComponents/WithPagination/WithPagination";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import styles from "./AdminAccounts.module.css";

class AdminAccounts extends Component {
  state = {
    selected: {},
    allSelected: false,
    refresh: false
  };

  componentWillUnmount() {
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
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
      .post("/api/admin/delete", Object.keys(this.state.selected), { cancelToken: this.cancelDeleteRequest.token }, true, true)
      .then(res => {
        this.setState(() => ({ refresh: !this.state.refresh }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleAdd = () => {
    if(!this.props.user.allowEdit) {
      return this.props.flashErrorMessage();
    }
    this.props.history.push("/admin/admin_account");
  };

  handleEdit = (id) => () => {
    this.props.history.push("/admin/admin_account/" + id);
  };

  render() {
    return (
      <WithPagination
        isAdmin={true}
        flashErrorMessage={this.props.flashErrorMessage}
        fetchUrl="/api/admin?page="
        fetchUseSession
        fetchAdmin
        refresh={this.state.refresh}
        renderTitle={() => (
          <div className={styles.TitleBox}>
            ADMIN ACCOUNTS
            <Button type="add" onClick={this.handleAdd} />
            <Button type="delete" onClick={this.handleDelete} />
          </div>
        )}
        renderItems={accounts => (
          <table className={styles.Table}>
            <thead>
              <tr>
                <th><Checkbox handleSelect={this.handleSelectAll} isChecked={this.state.allSelected} id="ALL" /></th>
                <th>Name</th>
                <th className={styles.CollapseLarge}>Email</th>
                <th className={styles.Collapse}>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => {
                return (
                  <tr key={account._id}>
                    <td><Checkbox handleSelect={this.handleSelect} isChecked={this.state.selected[account._id]} id={account._id} /></td>
                    <td>{`${account.firstName} ${account.lastName}`}</td>
                    <td className={styles.CollapseLarge}>{account.email}</td>
                    <td className={styles.Collapse}>{account.active ? "Yes" : "No"}</td>
                    <td>
                      <Button type="edit" onClick={this.handleEdit(account._id)} />
                    </td>
                  </tr>
                );
              })}
              {!accounts.length ? (
                <tr>
                  <td colSpan={6}>No admin accounts found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      />
    );
  }
}

export default AdminAccounts;