import React from "react";

import styles from "./ArrowIcon.module.css";

const ArrowIcon = ({ direction }) => {
  return (
    <svg className={styles.ArrowIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      {direction === "left" ? <path d="M0 12l9-8v6h15v4h-15v6z"/> : <path d="M24 12l-9-8v6h-15v4h15v6z"/>}
    </svg>
  );
};

export default ArrowIcon;