import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import styles from "./Modal.module.css";

class Modal extends Component {
  state = {
    show: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ show: true });
    }, 0);
  }

  onTopLevelClick = (e) => {
    if(e.target === e.currentTarget) {
      this.close();
    }
  }

  close = (redirectUrl) => {
    this.setState({ show: false });

    if(typeof redirectUrl === "string") {
      this.props.history.push(redirectUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
      this.props.close();
    }, 300);
  }

  render() {
    return (
      <div className={`${styles.Modal} ${this.state.show ? styles.Show : ""}`} onClick={this.onTopLevelClick}>
        <div style={this.props.style || {}} className={`${styles.Content} ${this.state.show ? styles.Show : ""}`}>
          <div className={styles.CloseButton} onClick={this.close}>&times;</div>
          {this.props.children || this.props.renderContent(this.close)}
        </div>
      </div>
    );
  }
}

export default withRouter(Modal);