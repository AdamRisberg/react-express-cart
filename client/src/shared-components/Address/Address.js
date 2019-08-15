import React from "react";

import styles from "./Address.module.css";

const Address = ({ address, title, showPhone, className = "" }) => {
  return (
    <div className={`${styles.Address} ${className}`}>
      {title ? <div className={styles.Title}>{title}:</div> : null}
      <div className={title ? "" : styles.Title}>
        {address.firstName} {address.lastName}
      </div>
      <div>{address.address1}</div>
      {address.address2 && <div>{address.address2}</div>}
      <div>
        {address.city}, {address.state} {address.zip}
      </div>
      {showPhone && address.phone ? <div>Phone #: {address.phone}</div> : null}
    </div>
  );
};

export default Address;
