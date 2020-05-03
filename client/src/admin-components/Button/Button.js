import React from "react";

import Icons from "../Icons/Icons";

import styles from "./Button.module.css";

const Button = ({
  type,
  onClick,
  style = {},
  float = "none",
  children,
  ...props
}) => {
  let buttonStyle;
  let Icon;

  switch (type) {
    case "edit":
      buttonStyle = styles.Edit;
      Icon = Icons.Edit;
      break;
    case "delete":
      buttonStyle = styles.Delete;
      Icon = Icons.Delete;
      break;
    case "add":
      buttonStyle = styles.Add;
      Icon = Icons.Add;
      break;
    case "view":
      buttonStyle = styles.View;
      Icon = Icons.View;
      break;
    case "exit":
      buttonStyle = styles.Exit;
      Icon = Icons.Exit;
      break;
    case "cancel":
      buttonStyle = styles.Cancel;
      break;
    case "submit":
      buttonStyle = styles.Submit;
      break;
    default:
      buttonStyle = styles.Default;
      Icon = null;
  }

  const buttonType = type === "submit" ? "submit" : "button";

  return (
    <button
      type={buttonType}
      className={`${styles.Button} ${buttonStyle} ${styles[float]}`}
      style={style}
      onClick={onClick}
      {...props}
    >
      {Icon ? <Icon /> : null}
      {children}
    </button>
  );
};

export default Button;
