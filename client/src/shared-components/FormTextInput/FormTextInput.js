import React from "react";
import styles from "./FormTextInput.module.css";

const FormTextInput = ({
  label,
  handleOnChange,
  handleOnBlur,
  value,
  valid
}) => {
  return (
    <React.Fragment>
      <label htmlFor={label} className={styles.Label}>
        {label}
      </label>
      <input
        id={label}
        className={`${styles.Input} ${valid ? "" : styles.Invalid}`}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        value={value}
      />
    </React.Fragment>
  );
};

export default FormTextInput;
