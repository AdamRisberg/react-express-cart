import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FocusLock from "react-focus-lock";

import styles from "./Modal.module.css";

class Modal extends Component {
  state = {
    show: false
  };

  componentDidMount() {
    this.body = document.querySelector("body");
    this.scrollbarWidth = this.getScrollbarWidth();

    this.body.style.overflow = "hidden";
    this.body.style.marginRight = this.scrollbarWidth + "px";

    setTimeout(() => {
      this.setState({ show: true });
    }, 0);
  }

  componentWillUnmount() {
    this.body.style.overflow = "visible";
    this.body.style.marginRight = "0px";
  }

  getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  onTopLevelClick = e => {
    if (e.target === e.currentTarget) {
      this.close();
    }
  };

  close = redirectUrl => {
    this.setState({ show: false });

    if (typeof redirectUrl === "string") {
      this.props.history.push(redirectUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
      this.props.close();
    }, 300);
  };

  getModalStyle() {
    return `${styles.Modal} ${this.state.show ? styles.Show : ""}`;
  }

  getContentStyle() {
    const baseStyle =
      this.props.position === "left" ? styles.SideContent : styles.Content;
    return `${baseStyle} ${this.state.show ? styles.Show : ""}`;
  }

  getButtonStyle() {
    return this.props.altCloseButton
      ? styles.CloseButtonAlt
      : styles.CloseButton;
  }

  render() {
    return (
      <FocusLock>
        <div className={this.getModalStyle()} onClick={this.onTopLevelClick}>
          <div
            style={this.props.style || {}}
            className={this.getContentStyle()}
          >
            <button className={this.getButtonStyle()} onClick={this.close}>
              &times;
            </button>
            {this.props.children || this.props.renderContent(this.close)}
          </div>
        </div>
      </FocusLock>
    );
  }
}

export default withRouter(Modal);
