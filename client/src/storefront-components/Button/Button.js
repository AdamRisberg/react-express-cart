import React from "react";

import styles from "./Button.module.css";

const Button = ({
  text,
  onClick,
  buttonStyle = "Default",
  className = "",
  type = "button",
  size = "Medium",
  float = "None",
  noMargin,
  bold,
  disabled,
  children
}) => {
  const dynamicClassNames = `${styles[buttonStyle]} ${styles[size]} ${
    styles[float]
  } ${noMargin ? styles.NoMargin : ""} ${bold ? styles.Bold : ""}`;

  return (
    <button
      type={type}
      className={`${styles.Button} ${dynamicClassNames} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text || children}
    </button>
  );
};

export default Button;
