import React, { Component } from "react";

import styles from "./Spinner.module.css";

class Spinner extends Component {
  state = {
    display: false
  };

  componentDidMount() {
    this.timer = setTimeout(this.displaySpinner, this.props.delay || 200);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  displaySpinner = () => {
    this.setState(() => ({ display: true }));
  };

  render() {
    if (!this.state.display) {
      return null;
    }

    return (
      <div style={this.props.style} className={styles.SpinnerBox}>
        <div className={styles.Spinner} />
      </div>
    );
  }
}

export default Spinner;
