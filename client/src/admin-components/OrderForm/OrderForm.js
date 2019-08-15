import React, { Component } from "react";
import api from "../../api";
import { Redirect } from "react-router-dom";
import {
  handleAdminRequestError,
  handleAdminRequestErrorFull
} from "../../utils";

import Spinner from "../../shared-components/Spinner/Spinner";
import OrderView from "../../shared-components/OrderView/OrderView";
import StatusHistoryForm from "./StatusHistoryForm/StatusHistoryForm";
import StatusHistory from "./StatusHistory/StatusHistory";

const historyDefault = {
  status: "Processing",
  notified: "Yes",
  tracking: "",
  comment: ""
};

class OrderForm extends Component {
  state = {
    order: {},
    loading: true,
    history: historyDefault
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/orders/" + this.props.match.params.id,
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ order: res.data, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ loading: false, order: null }));
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
  }

  handleHistoryChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({
      history: {
        ...this.state.history,
        [key]: value
      }
    }));
  };

  handleAddHistory = e => {
    e.preventDefault();
    this.cancelPostRequest = api.getCancelTokenSource();

    const trackingText = this.state.history.tracking.trim();
    const tracking = trackingText.split(",").map(t => t.trim());

    const historyItem = {
      ...this.state.history,
      tracking: trackingText ? tracking : []
    };

    api
      .post(
        "/api/orders/history/" + this.state.order._id,
        historyItem,
        { cancelToken: this.cancelPostRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ order: res.data, history: historyDefault }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.order) {
      return <Redirect to="/admin/orders" />;
    }

    return (
      <React.Fragment>
        <OrderView style={{ marginBottom: "40px" }} order={this.state.order} />
        <StatusHistory history={this.state.order.history} />
        <StatusHistoryForm
          {...this.state.history}
          onSubmit={this.handleAddHistory}
          onChange={this.handleHistoryChange}
        />
      </React.Fragment>
    );
  }
}

export default OrderForm;
