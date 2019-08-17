import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import api from "../../api";

import OrderPreview from "./OrderPreview/OrderPreview";
import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Title from "../../shared-components/Title/Title";
import Spinner from "../../shared-components/Spinner/Spinner";

import styles from "./Orders.module.css";

class Orders extends Component {
  state = {
    years: []
  };

  componentDidMount() {
    if (!this.props.user) return;
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/orders/years/" + this.props.user.id,
        { cancelToken: this.cancelGetRequest.token },
        true,
        false
      )
      .then(response => {
        this.setState(() => ({ years: response.data }));
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  render() {
    if (!this.props.user && !this.props.loadingUser) {
      return <Redirect to="/" />;
    }

    if (this.props.loadingUser) {
      return <Spinner />;
    }

    const fetchUrl = "/api/orders/all/" + this.props.user.id + "?page=";
    const dateOptions = [];
    const yearOptions = this.state.years.map((year, i) => {
      return <option key={i}>{year}</option>;
    });
    dateOptions.push(
      <option key="last30" value="last30">
        last 30 days
      </option>
    );
    dateOptions.push(
      <option key="last6" value="last6">
        last 6 months
      </option>
    );
    dateOptions.push(...yearOptions);

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Order History - ${this.props.storeName}`}</title>
        </Helmet>
        <WithPagination
          fetchUrl={fetchUrl}
          fetchUseSession
          renderTitle={() => <Title text="Orders" underline centerOnMobile />}
          renderFilters={(filter, handleChange) => (
            <div className={styles.OrderFilter}>
              <span>Within: </span>
              <select onChange={handleChange} defaultValue={filter}>
                {dateOptions}
              </select>
            </div>
          )}
          renderItems={items =>
            !items.length ? (
              <span>You have no orders.</span>
            ) : (
              items.map(order => <OrderPreview key={order._id} {...order} />)
            )
          }
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings, user }) => ({
  storeName: settings.store_name,
  user: user.user,
  loadingUser: user.loadingUser
});

export default connect(mapStateToProps)(Orders);
