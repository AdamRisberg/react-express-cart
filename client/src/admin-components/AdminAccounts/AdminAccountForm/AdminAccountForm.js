import React, { Component } from "react";
import api from "../../../api";
import { handleAdminRequestError } from "../../../utils";
import { Redirect } from "react-router-dom";

import Spinner from "../../../shared-components/Spinner/Spinner";
import Button from "../../Button/Button";

import styles from "./AdminAccountForm.module.css";

class AdminAccountForm extends Component {
  state = {
    admin: {
      firstName: "",
      lastName: "",
      email: "",
      active: true,
      allowEdit: false
    },
    loading: true,
    validateMessage: "",
    newPassword: "",
    confirmPassword: ""
  };

  componentDidMount() {
    const adminID = this.props.match.params.id;

    if (adminID) {
      this.fetchAdminAccount(adminID);
    } else {
      this.setState(() => ({ loading: false }));
    }
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelPutRequest && this.cancelPutRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
  }

  fetchAdminAccount(id) {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        `/api/admin/${id}`,
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ admin: res.data, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ loading: false, admin: null }));
      });
  }

  onChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({
      admin: {
        ...this.state.admin,
        [key]: value
      }
    }));
  };

  trimInputValue = key => e => {
    const value = e.target.value.trim();

    this.setState(() => ({
      admin: {
        ...this.state.admin,
        [key]: value
      }
    }));
  };

  trimPasswordValue = key => e => {
    const value = e.target.value.trim();

    this.setState(() => ({ [key]: value }));
  };

  onPasswordChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({ [key]: value }));
  };

  validatePassword() {
    let message = "";

    if (!this.state.newPassword) {
      message = "Active admin accounts require a valid password.";
    }

    if (!this.state.confirmPassword && !message) {
      message = "Please confirm password.";
    }

    if (this.state.newPassword !== this.state.confirmPassword && !message) {
      message = "Password fields do not match.";
    }

    if (this.state.newPassword.length < 5 && !message) {
      message = "Password must be at least 5 characters long.";
    }

    if (message) {
      this.setState(() => ({ validateMessage: message }));
      return false;
    }

    return true;
  }

  handleFormSubmit = e => {
    e.preventDefault();

    if (
      !this.state.admin.hasPassword &&
      this.state.admin.active &&
      !this.validatePassword()
    ) {
      return;
    } else if (this.state.newPassword && !this.validatePassword()) {
      return;
    }

    if (this.state.admin._id) {
      this.saveChanges();
    } else {
      this.saveNewAdmin();
    }
  };

  saveChanges() {
    this.cancelPutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/admin/" + this.state.admin._id,
        {
          ...this.state.admin,
          password: this.state.newPassword
        },
        { cancelToken: this.cancelPutRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/admin_accounts");
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ validateMessage: err.response.data }));
      });
  }

  saveNewAdmin() {
    this.cancelPostRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/admin",
        {
          ...this.state.admin,
          password: this.state.newPassword
        },
        { cancelToken: this.cancelPostRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/admin_accounts");
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ validateMessage: err.response.data }));
      });
  }

  handleCancel = () => {
    this.props.history.push("/admin/admin_accounts");
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.admin) {
      return <Redirect to="/admin/admin_accounts" />;
    }

    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Admin Account</div>
        </div>
        <form onSubmit={this.handleFormSubmit} className={styles.Admin}>
          <label>
            First Name
            <input
              type="text"
              onBlur={this.trimInputValue("firstName")}
              onChange={this.onChange("firstName")}
              value={this.state.admin.firstName}
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              onBlur={this.trimInputValue("lastName")}
              onChange={this.onChange("lastName")}
              value={this.state.admin.lastName}
            />
          </label>
          <label>
            Email
            <input
              type="text"
              onBlur={this.trimInputValue("email")}
              onChange={this.onChange("email")}
              value={this.state.admin.email}
            />
          </label>
          <label>
            {this.state.admin.hasPassword ? "Change Password" : "Password"}
            <input
              type="password"
              onBlur={this.trimPasswordValue("newPassword")}
              onChange={this.onPasswordChange("newPassword")}
              value={this.state.newPassword}
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              onBlur={this.trimPasswordValue("confirmPassword")}
              onChange={this.onPasswordChange("confirmPassword")}
              value={this.state.confirmPassword}
            />
          </label>
          <label>
            Active
            <select
              onChange={this.onChange("active")}
              value={this.state.admin.active}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
          <label>
            Allow Edit
            <select
              onChange={this.onChange("allowEdit")}
              value={this.state.admin.allowEdit}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
          {this.state.validateMessage ? (
            <div className={styles.ValidateMessage}>
              {this.state.validateMessage}
            </div>
          ) : null}
          <Button onClick={this.handleCancel} type="cancel" float="left">
            Cancel
          </Button>
          <Button type="submit" float="right">
            SAVE
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminAccountForm;
