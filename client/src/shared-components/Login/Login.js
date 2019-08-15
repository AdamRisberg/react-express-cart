import React, { Component } from "react";
import { isEmail, isLength } from "validator";

import Button from "../../storefront-components/Button/Button";

import styles from "./Login.module.css";

class Login extends Component {
  state = {
    firstName: {
      label: "First Name",
      value: "",
      valid: true,
      isRegister: true,
      errorMessage: "Required"
    },
    lastName: {
      label: "Last Name",
      value: "",
      valid: true,
      isRegister: true,
      errorMessage: "Required"
    },
    email: {
      label: "Email",
      value: "",
      valid: true,
      errorMessage: "Must be valid email address"
    },
    password: {
      label: "Password",
      value: "",
      valid: true,
      errorMessage: "Must be 8 characters or longer"
    },
    repeatPassword: {
      label: "Repeat Password",
      value: "",
      valid: true,
      isRegister: true,
      errorMessage: "Passwords do not match"
    },
    invalid: false
  };

  focusInput = component => {
    if (component) {
      setTimeout(() => component.focus(), 100);
    }
  };

  onInputChange = name => e => {
    const value = e.target.value;

    this.setState(() => ({
      [name]: { ...this.state[name], value, valid: true }
    }));
  };

  validate(name, value) {
    if (!this.props.isRegister) return true;

    switch (name) {
      case "email":
        return isEmail(value.trim());
      case "password":
        return isLength(value.trim(), { min: 8 });
      case "repeatPassword":
        return value === this.state.password.value;
      default:
        return isLength(value.trim(), { min: 3 });
    }
  }

  validateForm() {
    let valid = true;
    const changes = {};

    Object.keys(this.state).forEach(key => {
      if (key !== "invalid" && !this.validate(key, this.state[key].value)) {
        changes[key] = {
          ...this.state[key],
          valid: false
        };
        valid = false;
      }
    });

    this.setState(() => ({ ...changes }));
    return valid;
  }

  onSubmit = e => {
    e.preventDefault();

    if (!this.validateForm()) return;

    const formData = {};
    Object.keys(this.state).forEach(key => {
      if (key !== "invalid") {
        formData[key] = this.state[key].value.trim();
      }
    });

    if (this.props.isRegister) {
      return this.props.onRegister({ ...formData });
    }
    this.props.onLogin({ ...formData }, null, () => {
      this.setState({ invalid: true });
    });
  };

  renderInputs() {
    return Object.keys(this.state).map(key => {
      if (key === "invalid") return null;

      if (
        !this.state[key].isRegister ||
        (this.props.isRegister && this.state[key].isRegister)
      ) {
        let inputType = "text";
        if (key === "email" || key === "password") inputType = key;
        if (key === "repeatPassword") inputType = "password";
        const shouldFocus =
          (this.props.isRegister && key === "firstName") ||
          (!this.props.isRegister && key === "email");

        return (
          <React.Fragment key={key}>
            <label htmlFor={key} className={styles.Label}>
              {this.state[key].label}
            </label>
            {this.state[key].valid ? null : (
              <div className={styles.ErrorMessage}>
                {this.state[key].errorMessage}
              </div>
            )}
            <input
              className={`${styles.Input} ${
                this.state[key].valid ? "" : styles.Invalid
              }`}
              id={key}
              type={inputType}
              onChange={this.onInputChange(key)}
              value={this.state[key].value}
              ref={shouldFocus ? this.focusInput : ""}
              required
            />
          </React.Fragment>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.TitleBox}>
          <h1
            className={`${styles.Title} ${
              this.props.leftTitle ? styles.Left : ""
            }`}
          >
            {this.props.isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
          </h1>
          {this.state.invalid ? (
            <div className={styles.Warning}>
              Email and/or password is incorrect
            </div>
          ) : null}
        </div>
        <form onSubmit={this.onSubmit}>
          {this.renderInputs()}
          <Button
            text={this.props.isRegister ? "Create Account" : "Sign In"}
            buttonStyle="Submit"
            type="submit"
            size="Wide"
            bold
          />
        </form>
        {!this.props.hideRegister ? (
          <div className={styles.BottomText}>
            {this.props.isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
            <span
              onClick={
                this.props.isRegister
                  ? this.props.showLogin
                  : this.props.showRegister
              }
            >
              {this.props.isRegister ? "Sign In" : "Create Account"}
            </span>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Login;
