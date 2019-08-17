import React, { Component } from "react";
import { isEmail } from "validator";
import { connect } from "react-redux";
import { editUser } from "../../redux/user/user-actions";

import Button from "../Button/Button";
import Title from "../../shared-components/Title/Title";
import Spinner from "../../shared-components/Spinner/Spinner";
import FlipMove from "react-flip-move";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styles from "./Profile.module.css";

const defaultState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  newPassword: "",
  confirmPassword: "",
  show: "",
  nameErrorMessage: "",
  emailErrorMessage: "",
  passwordErrorMessage: ""
};

class Profile extends Component {
  state = defaultState;

  handleOnChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({ [key]: value }));
  };

  handleEditClick = key => () => {
    this.setState(() => ({ ...defaultState, show: key }));
  };

  sendUpdateRequest(data, propKey, errorKey) {
    const errorCb = errorMessage => {
      this.setState({ [errorKey]: errorMessage });
    };

    this.props.editUser(data, propKey, this.handleEditClick(""), errorCb);
  }

  submitNameChange = e => {
    e.preventDefault();
    const firstName = this.state.firstName.trim();
    const lastName = this.state.lastName.trim();

    if (!firstName.trim() && !lastName) {
      return this.handleEditClick("")();
    }

    const data = {
      firstName: firstName || this.props.user.firstName,
      lastName: lastName || this.props.user.lastName,
      customerID: this.props.user.id
    };

    this.sendUpdateRequest(data, "name", "nameErrorMessage");
  };

  submitEmailChange = e => {
    e.preventDefault();

    const email = this.state.email.trim();

    if (!email) {
      return this.handleEditClick("")();
    }

    if (!isEmail(email)) {
      return this.setState(() => ({
        emailErrorMessage: "Please enter a valid email address."
      }));
    }

    const data = { email, customerID: this.props.user.id };

    this.sendUpdateRequest(data, "email", "emailErrorMessage");
  };

  submitPasswordChange = e => {
    e.preventDefault();

    const password = this.state.password.trim();
    const newPassword = this.state.newPassword.trim();
    const confirmPassword = this.state.confirmPassword.trim();

    if (!password || !newPassword || !confirmPassword) {
      return this.setState(() => ({
        passwordErrorMessage: "Please fill out all three fields."
      }));
    }

    if (newPassword !== confirmPassword) {
      return this.setState(() => ({
        passwordErrorMessage: `"Confirm New Password" doesn't match "New Password."`
      }));
    }

    const data = {
      oldPassword: password,
      newPassword: newPassword,
      customerID: this.props.user.id
    };

    this.sendUpdateRequest(data, "password", "passwordErrorMessage");
  };

  renderNamePreview() {
    if (this.state.show === "name") {
      return null;
    }

    return (
      <div key="name-preview-box" className={styles.PreviewBox}>
        <div className={styles.Preview}>
          <div className={styles.PreviewLabel}>Name:</div>
          <div>
            {this.props.user.firstName + " " + this.props.user.lastName}
          </div>
        </div>
        <Button onClick={this.handleEditClick("name")} noMargin float="Right">
          EDIT
        </Button>
      </div>
    );
  }

  renderNameForm() {
    if (this.state.show !== "name") {
      return null;
    }

    return (
      <form
        key="name-edit-box"
        onSubmit={this.submitNameChange}
        className={`${styles.PreviewBox} ${styles.Edit}`}
      >
        <label>
          First Name
          <input
            required
            defaultValue={this.props.user.firstName}
            onChange={this.handleOnChange("firstName")}
          />
        </label>
        <label>
          Last Name
          <input
            required
            defaultValue={this.props.user.lastName}
            onChange={this.handleOnChange("lastName")}
          />
        </label>
        {this.state.nameErrorMessage ? (
          <div className={styles.ErrorMessage}>
            {this.state.nameErrorMessage}
          </div>
        ) : null}
        <Button
          buttonStyle="Cancel"
          float="Left"
          noMargin
          onClick={this.handleEditClick("")}
        >
          Cancel
        </Button>
        <Button type="submit" buttonStyle="Submit" float="Right" noMargin>
          SAVE
        </Button>
      </form>
    );
  }

  renderEmailPreview() {
    if (this.state.show === "email") {
      return null;
    }

    return (
      <div key="email-preview-box" className={styles.PreviewBox}>
        <div className={styles.Preview}>
          <div className={styles.PreviewLabel}>Email:</div>
          <div>{this.props.user.email}</div>
        </div>
        <Button onClick={this.handleEditClick("email")} noMargin float="Right">
          EDIT
        </Button>
      </div>
    );
  }

  renderEmailForm() {
    if (this.state.show !== "email") {
      return null;
    }

    return (
      <form
        key="email-edit-box"
        onSubmit={this.submitEmailChange}
        className={`${styles.PreviewBox} ${styles.Edit}`}
      >
        <label>
          Email
          <input
            required
            defaultValue={this.props.user.email}
            onChange={this.handleOnChange("email")}
          />
        </label>
        {this.state.emailErrorMessage ? (
          <div className={styles.ErrorMessage}>
            {this.state.emailErrorMessage}
          </div>
        ) : null}
        <Button
          buttonStyle="Cancel"
          float="Left"
          noMargin
          onClick={this.handleEditClick("")}
        >
          Cancel
        </Button>
        <Button type="submit" buttonStyle="Submit" float="Right" noMargin>
          SAVE
        </Button>
      </form>
    );
  }

  renderPasswordPreview() {
    if (this.state.show === "password") {
      return null;
    }

    return (
      <div key="password-preview-box" className={styles.PreviewBox}>
        <div className={styles.Preview}>
          <div className={styles.PreviewLabel}>Password:</div>
          <div>************</div>
        </div>
        <Button
          onClick={this.handleEditClick("password")}
          noMargin
          float="Right"
        >
          EDIT
        </Button>
      </div>
    );
  }

  renderPasswordForm() {
    if (this.state.show !== "password") {
      return null;
    }

    return (
      <form
        key="password-edit-box"
        onSubmit={this.submitPasswordChange}
        className={`${styles.PreviewBox} ${styles.Edit}`}
      >
        <label>
          Current Password
          <input
            type="password"
            required
            onChange={this.handleOnChange("password")}
          />
        </label>
        <label>
          New Password
          <input
            type="password"
            required
            onChange={this.handleOnChange("newPassword")}
          />
        </label>
        <label>
          Confirm New Password
          <input
            type="password"
            required
            onChange={this.handleOnChange("confirmPassword")}
          />
        </label>
        {this.state.passwordErrorMessage ? (
          <div className={styles.ErrorMessage}>
            {this.state.passwordErrorMessage}
          </div>
        ) : null}
        <Button
          buttonStyle="Cancel"
          float="Left"
          noMargin
          onClick={this.handleEditClick("")}
        >
          Cancel
        </Button>
        <Button type="submit" buttonStyle="Submit" float="Right" noMargin>
          SAVE
        </Button>
      </form>
    );
  }

  render() {
    if (!this.props.user && !this.props.loadingUser) {
      return <Redirect to="/" />;
    }

    if (this.props.loadingUser) {
      return <Spinner />;
    }

    return (
      <div>
        <Helmet>
          <title>{`Account - ${this.props.storeName}`}</title>
        </Helmet>
        <Title text="Account Settings" underline centerOnMobile />
        <FlipMove>
          {[
            this.renderNamePreview(),
            this.renderNameForm(),
            this.renderEmailPreview(),
            this.renderEmailForm(),
            this.renderPasswordPreview(),
            this.renderPasswordForm()
          ]}
        </FlipMove>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, user }) => ({
  storeName: settings.store_name,
  user: user.user,
  loadingUser: user.loadingUser
});

const mapDispatchToProps = dispatch => ({
  editUser: (data, propKey, cb, errorCb) =>
    dispatch(editUser(data, propKey, cb, errorCb))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
