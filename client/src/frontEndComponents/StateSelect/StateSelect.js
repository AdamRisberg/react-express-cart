import React from "react";

import styles from "./StateSelect.module.css";

const STATES = ["AK","AL","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

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
          {STATES.map(state => <option key={state}>{state}</option>)}
        </select>
      </label>
    </React.Fragment>
  );
};

export default StateSelect;