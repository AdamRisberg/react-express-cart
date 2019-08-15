import React, { Component } from "react";
import api from "../../../api";
import {
  handleAdminRequestError,
  handleAdminRequestErrorFull
} from "../../../utils";
import { Redirect } from "react-router-dom";

import Spinner from "../../../shared-components/Spinner/Spinner";
import Button from "../../Button/Button";

import styles from "./ShippingForm.module.css";

class ShippingForm extends Component {
  state = {
    shipping: {
      name: "",
      label: "",
      price: 0,
      active: true
    },
    loading: true
  };

  componentDidMount() {
    const shippingID = this.props.match.params.id;

    if (shippingID) {
      this.fetchShipping(shippingID);
    } else {
      this.setState(() => ({ shipping: null, loading: false }));
    }
  }

  componentWillUnmount() {
    this.cancelGetShippingRequest && this.cancelGetShippingRequest.cancel();
    this.cancelPutShippingRequest && this.cancelPutShippingRequest.cancel();
  }

  fetchShipping(id) {
    this.cancelGetShippingRequest = api.getCancelTokenSource();

    api
      .get(
        `/api/shipping/${id}`,
        { cancelToken: this.cancelGetShippingRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ shipping: res.data.shipping, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ shipping: null, loading: false }));
      });
  }

  handleFormSubmit = e => {
    e.preventDefault();
    this.cancelPutShippingRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/shipping/" + this.state.shipping._id,
        this.state.shipping,
        { cancelToken: this.cancelPutShippingRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/shipping");
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  onChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({
      shipping: {
        ...this.state.shipping,
        [key]: value
      }
    }));
  };

  handleCancel = () => {
    this.props.history.push("/admin/shipping");
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.shipping) {
      return <Redirect to="/admin/shipping" />;
    }

    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Shipping Method</div>
        </div>
        <form onSubmit={this.handleFormSubmit} className={styles.Method}>
          <label>
            Name
            <input
              type="text"
              onChange={this.onChange("name")}
              value={this.state.shipping.name}
            />
          </label>
          <label>
            Label
            <input
              type="text"
              onChange={this.onChange("label")}
              value={this.state.shipping.label}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              onChange={this.onChange("price")}
              value={this.state.shipping.price}
            />
          </label>
          <label>
            Active
            <select
              onChange={this.onChange("active")}
              value={this.state.shipping.active}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
          <Button onClick={this.handleCancel} type="cancel" float="left">
            Cancel
          </Button>
          <Button type="submit" float="right">
            SAVE
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default ShippingForm;
