import React from "react";
import STATES from "./states";

import styles from "./StateSelect.module.css";

const StateSelect = ({ onChange, value }) => {
  return (
    <React.Fragment key="state_select">
      <label htmlFor="state" className={styles.Label}>
        State
        <select
          id="state"
          style={{ padding: ".25rem .35rem" }}
          onChange={onChange}
          value={value}
        >
          {STATES.map(state => (
            <option key={state}>{state}</option>
          ))}
        </select>
      </label>
    </React.Fragment>
  );
};

export default StateSelect;
