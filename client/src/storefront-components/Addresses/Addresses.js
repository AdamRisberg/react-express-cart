import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import {
  addAddress,
  editAddress,
  deleteAddress
} from "../../redux/user/user-actions";

import AddressCard from "./AddressCard/AddressCard";
import AddressForm from "../../shared-components/AddressForm/AddressForm";
import Title from "../../shared-components/Title/Title";
import Spinner from "../../shared-components/Spinner/Spinner";

import styles from "./Addresses.module.css";

class Addresses extends Component {
  state = {
    showForm: false,
    edit: false,
    currentAddress: null
  };

  handleOnSubmit = address => {
    if (this.state.edit) {
      this.props.editAddress(
        this.props.user.id,
        address,
        this.state.currentAddress._id
      );
    } else {
      address.default = true;
      this.props.addAddress(this.props.user.id, address);
    }

    this.setState(() => ({ showForm: false }));
  };

  handleCancel = e => {
    e.preventDefault();
    this.hideForm();
  };

  setAsDefault = addressID => {
    this.props.editAddress(this.props.user.id, { default: true }, addressID);
  };

  showNewForm = () => {
    this.setState(() => ({
      showForm: true,
      edit: false,
      currentAddress: null
    }));
  };

  showEditForm = address => {
    this.setState(() => ({
      showForm: true,
      edit: true,
      currentAddress: address
    }));
  };

  hideForm = () => {
    this.setState(() => ({ showForm: false }));
  };

  renderAddressCards() {
    return this.props.user.addresses.map((address, i) => {
      return (
        <AddressCard
          key={address.address1 + i}
          showEditForm={() => this.showEditForm(address)}
          setAsDefault={() => this.setAsDefault(address._id)}
          deleteAddress={this.props.deleteAddress}
          address={address}
          userID={this.props.user.id}
        />
      );
    });
  }

  render() {
    if (!this.props.user && !this.props.loadingUser) {
      return <Redirect to="/" />;
    }

    if (this.props.loadingUser) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Addresses - ${this.props.storeName}`}</title>
        </Helmet>
        {this.state.showForm ? (
          <AddressForm
            address={this.state.currentAddress}
            cancelButtonText="Cancel"
            submitButtonText={this.state.edit ? "Save Changes" : "Add Address"}
            title={this.state.edit ? "Edit Address" : "Add New Address"}
            handleOnSubmit={this.handleOnSubmit}
            handleCancel={this.handleCancel}
          />
        ) : (
          <div>
            <Title text="Addresses" underline centerOnMobile />
            {!this.props.user.addresses || !this.props.user.addresses.length ? (
              <div className={styles.NoAddressesMessage}>
                Add addresses to speed up future checkouts.
              </div>
            ) : null}
            <div className={styles.AddressContainer}>
              {this.renderAddressCards()}
              <AddressCard onBlankClick={this.showNewForm} blank={true} />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings, user }) => ({
  storeName: settings.store_name,
  user: user.user,
  loadingUser: user.loadingUser
});

const mapDispatchToProps = dispatch => ({
  addAddress: (userID, address) => dispatch(addAddress(userID, address)),
  editAddress: (userID, address, addressID) =>
    dispatch(editAddress(userID, address, addressID)),
  deleteAddress: (userID, addressID) =>
    dispatch(deleteAddress(userID, addressID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Addresses);
