import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FocusLock from "react-focus-lock";

import styles from "./Modal.module.css";

class Modal extends Component {
  state = {
    show: false
  };

  scrollIsLocked = false;

  componentDidMount() {
    this.lockScrollbar(true);

    setTimeout(() => {
      this.setState({ show: true });
    }, 0);
  }

  componentWillUnmount() {
    if (this.scrollIsLocked) {
      this.lockScrollbar(false);
    }
  }

  lockScrollbar(lock) {
    if (lock) {
      this.scrollIsLocked = true;
      this.scrollbarWidth = this.getScrollbarWidth();
      this.scrollY = window.scrollY || window.pageYOffset;

      document.body.style.top = `-${this.scrollY || 0}px`;
      document.body.style.position = "fixed";
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    } else {
      this.scrollIsLocked = false;
      document.body.style.position = "static";
      document.body.style.top = "";
      document.body.style.paddingRight = "0px";

      window.scrollTo(0, this.scrollY || 0);
    }
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
    this.lockScrollbar(false);

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
    const { modalType } = this.props;
    let baseStyle;

    if (modalType === "left") {
      baseStyle = styles.SideContent;
    } else if (modalType === "image") {
      baseStyle = styles.ImageContent;
    } else {
      baseStyle = styles.Content;
    }

    return `${baseStyle} ${this.state.show ? styles.Show : ""}`;
  }

  getButtonStyle() {
    const { buttonType } = this.props;

    if (buttonType === "left") {
      return styles.CloseButtonAlt;
    } else if (buttonType === "image") {
      return styles.CloseButtonImage;
    } else {
      return styles.CloseButton;
    }
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
