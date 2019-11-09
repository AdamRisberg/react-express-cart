import React from "react";

import styles from "./ProductOption.module.css";

const ProductOption = props => {
  let inputField;

  switch (props.optionType) {
    case "text":
      inputField = createTextInput(props);
      break;
    case "select":
      inputField = createSelect(props);
      break;
    case "radio":
      inputField = createRadio(props);
      break;
    case "textRadio":
      inputField = createTextRadio(props);
      break;
    case "colorRadio":
      inputField = createColorRadio(props);
      break;
    default:
      return null;
  }

  return inputField;
};

function createSelect({ _id, options, inputChange, value, label }) {
  const selectOptions = options.map(option => {
    return (
      <option key={option.label} value={option.label}>
        {option.label}
      </option>
    );
  });

  return (
    <React.Fragment>
      <label htmlFor={label} className={styles.Label}>
        {label}
      </label>
      <select
        id={label}
        value={value}
        className={styles.Input}
        onChange={e =>
          inputChange(
            _id,
            options[e.target.options.selectedIndex].price,
            e.target.value
          )
        }
      >
        {selectOptions}
      </select>
    </React.Fragment>
  );
}

function createTextInput({ _id, inputChange, value, label }) {
  return (
    <React.Fragment>
      <label htmlFor={label} className={styles.Label}>
        {label}
      </label>
      <input
        id={label}
        type="text"
        className={styles.Input}
        value={value}
        onChange={e => inputChange(_id, 0, e.target.value)}
      />
    </React.Fragment>
  );
}

function createRadio({ _id, options, inputChange, value, label }) {
  return (
    <fieldset className={styles.Label}>
      <legend>{label}</legend>
      {options.map(option => {
        return (
          <label key={option.label + "l"}>
            <input
              aria-label={option.label}
              type="radio"
              className={styles.RadioInput}
              checked={value === option.label}
              key={option.label}
              name={_id}
              value={option.label}
              onChange={e => inputChange(_id, option.price, e.target.value)}
            />
            <span className={styles.RadioLabel}>{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function createTextRadio({ _id, options, inputChange, value, label }) {
  return (
    <fieldset className={styles.Label}>
      <legend>{label}</legend>
      {options.map(option => {
        return (
          <label key={option.label + "l"} className={styles.TextRadioLabel}>
            <input
              aria-label={option.label}
              className={styles.TextRadioInput}
              type="radio"
              checked={value === option.label}
              key={option.label}
              name={_id}
              value={option.label}
              onChange={e => inputChange(_id, option.price, e.target.value)}
            />
            <span className={styles.TextRadio}>{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function createColorRadio({ _id, options, inputChange, value, label }) {
  return (
    <fieldset className={styles.Label}>
      <legend>{label}</legend>
      {options.map(option => {
        return (
          <label key={option.label + "l"} className={styles.ColorRadioLabel}>
            <input
              aria-label={option.label}
              className={styles.TextRadioInput}
              type="radio"
              checked={value === option.label}
              key={option.label}
              name={_id}
              value={option.label}
              onChange={e => inputChange(_id, option.price, e.target.value)}
            />
            <span className={styles.ColorRadio}>
              <span
                style={{ backgroundColor: option.color }}
                className={styles.Color}
              />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export default ProductOption;
