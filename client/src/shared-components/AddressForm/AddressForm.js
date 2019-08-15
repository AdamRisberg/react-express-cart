import React, { Component } from "react";
import { isEmail, isEmpty, isMobilePhone, isPostalCode } from "validator";

import FormTextInput from "../FormTextInput/FormTextInput";
import Title from "../Title/Title";
import Button from "../../storefront-components/Button/Button";
import StateSelect from "../StateSelect/StateSelect";

import styles from "./AddressForm.module.css";

class AddressForm extends Component {
  state = {
    firstName: {
      label: "First Name",
      value: "",
      valid: true
    },
    lastName: {
      label: "Last Name",
      value: "",
      valid: true
    },
    address1: {
      label: "Address 1",
      value: "",
      valid: true
    },
    address2: {
      label: "Address 2 (optional)",
      value: "",
      valid: true
    },
    city: {
      label: "City",
      value: "",
      valid: true
    },
    state: {
      label: "State",
      value: "",
      valid: true
    },
    zip: {
      label: "Zip Code",
      value: "",
      valid: true
    },
    phone: {
      label: "Phone Number",
      value: "",
      valid: true
    },
    email: {
      label: "Email",
      value: "",
      valid: true
    }
  };

  componentDidMount() {
    if (this.props.address) {
      this.resetAddress(this.props.address);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.address && !prevProps.address) {
      this.resetAddress(this.props.address);
    }
  }

  handleOnChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({
      [key]: { ...this.state[key], value, valid: true }
    }));
  };

  handleOnBlur = key => e => {
    const value = e.target.value.trim();
    const valid = this.validate(key, value);

    this.setState(() => ({
      [key]: { ...this.state[key], value, valid }
    }));
  };

  handleOnSubmit = e => {
    e.preventDefault();
    if (!this.checkFormValid()) return;

    const address = Object.keys(this.state).reduce((acc, key) => {
      if (key !== "email" || this.props.includeEmail) {
        acc[key] = this.state[key].value.trim();
      }
      return acc;
    }, {});
    this.props.handleOnSubmit(address);
  };

  validate(key, value) {
    switch (key) {
      case "email":
        return !this.props.includeEmail || isEmail(value);
      case "zip":
        return isPostalCode(value, "US");
      case "phone":
        return isMobilePhone(value, "en-US");
      case "address2":
        return true;
      default:
        return !isEmpty(value, { ignore_whitespace: true });
    }
  }

  checkFormValid() {
    let valid = true;

    const updateObj = Object.keys(this.state).reduce((acc, key) => {
      if (!this.validate(key, this.state[key].value)) {
        acc[key] = {
          ...this.state[key],
          valid: false
        };
        valid = false;
      }
      return acc;
    }, {});

    this.setState(() => updateObj);
    return valid;
  }

  resetAddress(defaultAddress) {
    const address = Object.keys(this.state).reduce((acc, key) => {
      acc[key] = {
        ...this.state[key],
        value: defaultAddress[key] || ""
      };
      return acc;
    }, {});
    this.setState(() => ({ ...address }));
  }

  renderFormInputs() {
    return Object.keys(this.state).map(key => {
      if (key === "email" && !this.props.includeEmail) {
        return null;
      }

      if (key === "state") {
        return (
          <StateSelect
            key={key}
            labelClassName={styles.Label}
            selectClassname={styles.Input}
            onChange={this.handleOnChange(key)}
            value={this.state[key].value}
          />
        );
      }
      return (
        <FormTextInput
          key={key}
          label={this.state[key].label}
          handleOnChange={this.handleOnChange(key)}
          handleOnBlur={this.handleOnBlur(key)}
          value={this.state[key].value}
          valid={this.state[key].valid}
        />
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.title ? <Title text={this.props.title} underline /> : null}
        <form onSubmit={this.handleOnSubmit} className={styles.AddressForm}>
          {this.renderFormInputs()}
          {this.props.renderExtras ? this.props.renderExtras() : null}
          <Button
            text={this.props.cancelButtonText}
            onClick={this.props.handleCancel}
            buttonStyle="Cancel"
            bold
          />
          <Button
            text={this.props.submitButtonText}
            buttonStyle="Submit"
            type="submit"
            bold
            float="Right"
          />
        </form>
      </React.Fragment>
    );
  }
}

export default AddressForm;
