import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestError } from "../../utils";
import { Redirect } from "react-router-dom";

import Spinner from "../../shared-components/Spinner/Spinner";
import Button from "../Button/Button";
import Address from "../../shared-components/Address/Address";

import AddressForm from "../../shared-components/AddressForm/AddressForm";

import styles from "./CustomerForm.module.css";

class CustomerForm extends Component {
  state = {
    loading: true,
    editIdx: 0,
    showEditForm: false,
    validateMessage: ""
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();
    const customerID = this.props.match.params.id;

    api
      .get(
        "/api/customers/" + customerID,
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ customer: res.data, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ customer: null, loading: false }));
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelPutRequest && this.cancelPutRequest.cancel();
  }

  handleChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({
      customer: {
        ...this.state.customer,
        [key]: value
      }
    }));
  };

  trimInputValue = key => e => {
    const value = e.target.value.trim();

    this.setState(() => ({
      customer: {
        ...this.state.customer,
        [key]: value
      }
    }));
  };

  handleFormSubmit = e => {
    e.preventDefault();
    this.cancelPutReqeust = api.getCancelTokenSource();

    api
      .put(
        "/api/customers/" + this.state.customer._id,
        { customer: this.state.customer },
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/customers");
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState({ validateMessage: err.response.data });
      });
  };

  handleCancel = () => {
    this.props.history.push("/admin/customers");
  };

  handleDeleteAddress = id => () => {
    const addresses = this.state.customer.addresses.filter(
      address => address._id !== id
    );
    this.setState(() => ({
      customer: {
        ...this.state.customer,
        addresses
      }
    }));
  };

  handleEditClick = idx => () => {
    this.setState(() => ({ editIdx: idx, showEditForm: true }));
  };

  handleCloseEdit = e => {
    if (e.target !== e.currentTarget) return;

    this.closeEdit();
  };

  closeEdit = () => {
    this.setState(() => ({ showEditForm: false }));
  };

  handleEditConfirm = editedAddress => {
    const editedAddressID = this.state.customer.addresses[this.state.editIdx]
      ._id;

    const addresses = this.state.customer.addresses.map(address => {
      if (address._id === editedAddressID) {
        return editedAddress;
      }
      return address;
    });

    this.setState(() => ({
      customer: {
        ...this.state.customer,
        addresses
      }
    }));
    this.closeEdit();
  };

  renderAddresses() {
    return this.state.customer.addresses.map((address, i) => (
      <div key={address._id + i} className={styles.Address}>
        <Address address={address} showPhone />
        <Button
          style={{ fontSize: "14px", padding: "6px 10px", marginTop: "10px" }}
          type="delete"
          float="left"
          onClick={this.handleDeleteAddress(address._id)}
        />
        <Button
          style={{ fontSize: "14px", padding: "6px 10px", marginTop: "10px" }}
          type="edit"
          float="right"
          onClick={this.handleEditClick(i)}
        />
      </div>
    ));
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.customer) {
      return <Redirect to="/admin/customers" />;
    }

    return (
      <React.Fragment>
        <form onSubmit={this.handleFormSubmit} className={styles.CustomerForm}>
          <div className={styles.Header}>
            <div className={styles.Title}>Customer</div>
          </div>
          <label>
            First Name
            <input
              onBlur={this.trimInputValue("firstName")}
              onChange={this.handleChange("firstName")}
              value={this.state.customer.firstName}
            />
          </label>
          <label>
            Last Name
            <input
              onBlur={this.trimInputValue("lastName")}
              onChange={this.handleChange("lastName")}
              value={this.state.customer.lastName}
            />
          </label>
          <label>
            Email
            <input
              onBlur={this.trimInputValue("email")}
              onChange={this.handleChange("email")}
              value={this.state.customer.email}
            />
          </label>
          <div className={`${styles.Addresses} ${styles.ClearFix}`}>
            {this.renderAddresses()}
          </div>
          {this.state.validateMessage ? (
            <div className={styles.ValidateMessage}>
              {this.state.validateMessage}
            </div>
          ) : null}
          <Button type="cancel" float="left" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button type="submit" float="right">
            SAVE
          </Button>
        </form>
        {this.state.showEditForm ? (
          <div className={styles.Modal} onClick={this.handleCloseEdit}>
            <div className={styles.ModalContent}>
              <AddressForm
                cancelButtonText="Cancel"
                submitButtonText="OK"
                handleCancel={this.closeEdit}
                handleOnSubmit={this.handleEditConfirm}
                address={this.state.customer.addresses[this.state.editIdx]}
              />
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default CustomerForm;
