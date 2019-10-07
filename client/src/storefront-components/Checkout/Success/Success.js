import React from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";

import Order from "../../Order/Order";

import styles from "./Success.module.css";

const Success = props => {
  if (!props.location.state) {
    return <Redirect to="/" />;
  }

  const { email, orderID, order } = props.location.state;

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Order Success - ${props.storeName}`}</title>
      </Helmet>
      <h3 className={styles.SuccessTitle}>
        Thank you! Your order was successfully processed.
      </h3>
      <p className={styles.SuccessParagraph}>
        An order comfirmation email has been sent to:
        <span className={styles.Bold}>{email}</span>
      </p>
      <Order orderID={orderID} order={order} checkout />
    </React.Fragment>
  );
};

const mapStateToProps = ({ settings }) => ({
  storeName: settings.store_name
});

export default connect(mapStateToProps)(Success);
