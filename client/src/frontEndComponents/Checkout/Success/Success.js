import React from "react";
import { Redirect } from "react-router-dom";
import Helmet from "react-helmet";

import Order from "../../Order/Order";

import styles from "./Success.module.css";

const Success = (props) => {
  if(!props.location.state) {
    return <Redirect to="/" />;
  }
  
  const email = props.location.state.email;
  const orderID = props.location.state.orderID;

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Order Success - ${props.storeName}`}</title>
      </Helmet>
      <h3 className={styles.SuccessTitle}>Thank you! Your order was successfully processed.</h3>
      <p className={styles.SuccessParagraph}>
        An order comfirmation email has been sent to:
        <span className={styles.Bold}>
          {email}
        </span>
      </p>
      <Order orderID={orderID} checkout />
    </React.Fragment>
  );
};

export default Success;