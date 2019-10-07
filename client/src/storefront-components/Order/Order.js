import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import api from "../../api";

import Spinner from "../../shared-components/Spinner/Spinner";
import OrderView from "../../shared-components/OrderView/OrderView";

class Order extends Component {
  state = {
    loading: true,
    error: false
  };

  componentDidMount() {
    if (this.props.order) {
      return this.setState({ loading: false, order: this.props.order });
    }

    this.cancelGetRequest = api.getCancelTokenSource();

    const orderID = this.props.orderID || this.props.match.params.id;

    api
      .get(
        `/api/orders/${orderID}`,
        { cancelToken: this.cancelGetRequest.token },
        true,
        false
      )
      .then(response => {
        this.setState({ order: response.data, loading: false });
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        this.setState({ loading: false, error: true });
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  render() {
    if (this.state.loading || this.props.loadingUser) {
      return <Spinner />;
    }

    if ((!this.props.user && !this.props.checkout) || this.state.error) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Order #: ${this.state.order.orderNumber} - ${this.props.storeName}`}</title>
        </Helmet>
        <OrderView order={this.state.order} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings, user }) => ({
  storeName: settings.store_name,
  user: user.user,
  loadingUser: user.loadingUser
});

export default connect(mapStateToProps)(Order);
