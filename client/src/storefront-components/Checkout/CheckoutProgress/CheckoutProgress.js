import React from "react";
import styles from "./CheckoutProgress.module.css";

const steps = [
  "Billing Address",
  "Shipping Address",
  "Shipping Method",
  "Payment Method"
];

const CheckoutProgress = ({ currentStep }) => {
  const curStep = currentStep - 1;

  return (
    <div className={styles.CheckoutProgress}>
      {steps.map((step, i) => {
        let labelClass = "";
        let stepBetweenClass = "";

        if (i < curStep) {
          stepBetweenClass = styles.Done;
        } else if (i > curStep) {
          labelClass = styles.DisabledLabel;
          stepBetweenClass = styles.Disabled;
        }

        return (
          <React.Fragment key={step + i}>
            <div className={`${styles.Step} ${stepBetweenClass}`}>
              {i < curStep ? (
                <span className={styles.Check}>&#10004;</span>
              ) : (
                i + 1
              )}
              <span className={`${styles.Label} ${labelClass}`}>{step}</span>
            </div>
            {i < steps.length - 1 ? (
              <div className={`${styles.Between} ${stepBetweenClass}`} />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutProgress;
