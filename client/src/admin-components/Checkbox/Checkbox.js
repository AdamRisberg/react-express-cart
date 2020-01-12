import React from "react";

import styles from "./Checkbox.module.css";

const Checkbox = ({ handleSelect, id, value, isChecked }) => {
  const checked = isChecked ? "checked" : "";

  return (
    <React.Fragment>
      <input
        onChange={handleSelect}
        id={id}
        value={value}
        className={styles.Checkbox}
        checked={checked}
        type="checkbox"
      />
      <label htmlFor={id} className={styles.CheckboxLabel} />
    </React.Fragment>
  );
};

export default Checkbox;
