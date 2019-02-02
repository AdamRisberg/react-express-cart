import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Helmet from "react-helmet";

import AddressCard from "./AddressCard/AddressCard";
import AddressForm from "./AddressForm/AddressForm";
import Title from "../Title/Title";

import styles from "./Addresses.module.css"

class Addresses extends Component {
  state = {
    showForm: false,
    edit: false,
    currentAddress: null
  };

  handleOnSubmit = (address) => {
    if(this.state.edit) {
      this.props.editAddress(this.state.currentAddress._id, address);
    } else {
      address.default = true;
      this.props.addAddress(address);
    }
    
    this.setState(() => ({ showForm: false }));
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.hideForm();
  }

  setAsDefault = (addressID) => {
    this.props.editAddress(addressID, { default: true });
  }

  showNewForm = () => {
    this.setState(() => ({ showForm: true, edit: false, currentAddress: null }));
  }

  showEditForm = (address) => {
    this.setState(() => ({ showForm: true, edit: true, currentAddress: address }));
  }

  hideForm = () => {
    this.setState(() => ({ showForm: false }));
  }

  renderAddressCards() {
    return this.props.user.addresses.map((address, i) => {
      return <AddressCard key={address.address1 + i} showEditForm={() => this.showEditForm(address)} setAsDefault={() => this.setAsDefault(address._id)} deleteAddress={this.props.deleteAddress} address={address} />
    });
  }

  render() {
    if(!this.props.loggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Addresses - ${this.props.storeName}`}</title>
        </Helmet>
        {this.state.showForm ?
          <AddressForm
            address={this.state.currentAddress}
            cancelButtonText="Cancel"
            submitButtonText={this.state.edit ? "Save Changes" : "Add Address"}
            title={this.state.edit ? "Edit Address" : "Add New Address"}
            handleOnSubmit={this.handleOnSubmit}
            handleCancel={this.handleCancel}
          /> : (
            <div>
              <Title text="Addresses" underline centerOnMobile />
              {!this.props.user.addresses || ! this.props.user.addresses.length ? (
                <div className={styles.NoAddressesMessage}>Add addresses to speed up future checkouts.</div>
              ) : null }
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

export default Addresses;