import React, { Component } from "react";
import api from "../../api";

import Spinner from "../../shared-components/Spinner/Spinner";
import Title from "../../shared-components/Title/Title";
import Button from "../Button/Button";

import styles from "./ShippingOptions.module.css";

class ShippingOptions extends Component {
  state = {
    options: [],
    loading: true
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/shipping/active",
        { cancelToken: this.cancelGetRequest.token },
        false,
        false
      )
      .then(res => {
        const options = res.data;
        this.setState(() => ({ options, loading: false }));

        if (options.length) {
          this.props.onShippingChange(
            options[0]._id,
            options[0].name,
            options[0].price
          )();
        }
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        this.setState(() => ({ loading: false }));
        console.log(err.response);
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        <Title text="Shipping Method" underline />
        <div className={styles.Options}>
          {this.state.options.map((option, i) => {
            return (
              <label key={option._id + i}>
                <input
                  type="radio"
                  value={option.name}
                  name="shipping"
                  onChange={this.props.onShippingChange(
                    option._id,
                    option.name,
                    option.price
                  )}
                  checked={this.props.shippingMethod === option.name}
                />
                <span className={styles.Bold}>{option.label}: </span>$
                {option.price.toFixed(2, 10)}
              </label>
            );
          })}
        </div>
        <Button
          text="Back"
          onClick={this.props.handleCancel}
          buttonStyle="Cancel"
          bold
        />
        <Button
          text="Continue"
          onClick={this.props.onNextStep}
          buttonStyle="Submit"
          bold
          float="Right"
        />
      </React.Fragment>
    );
  }
}

export default ShippingOptions;
