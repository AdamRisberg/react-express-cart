import React from "react";

import Modal from "../Modal/Modal";
import Login from "../../shared-components/Login/Login";
import { connect } from "react-redux";
import {
  showLogin,
  showRegister,
  hideLogin,
  login,
  register
} from "../../redux/user/user-actions";

function LoginWithModal(props) {
  if (!props.loginOpen) return null;

  return (
    <Modal
      close={props.hideLogin}
      renderContent={close => (
        <Login
          isRegister={props.isRegister}
          showRegister={props.showRegister}
          showLogin={props.showLogin}
          closeLogin={close}
          onLogin={props.login}
          onRegister={props.register}
        />
      )}
    />
  );
}

const mapStateToProps = ({ user }) => ({
  loginOpen: user.loginOpen,
  isRegister: user.isRegister
});

const mapDispatchToProps = dispatch => ({
  showLogin: () => dispatch(showLogin()),
  showRegister: () => dispatch(showRegister()),
  hideLogin: () => dispatch(hideLogin()),
  login: (formData, cb, errorCb) => dispatch(login(formData, cb, errorCb)),
  register: (formData, cb, errorCb) => dispatch(register(formData, cb, errorCb))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginWithModal);
