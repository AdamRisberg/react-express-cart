import React from "react";
import Button from "../../Button/Button";

import styles from "./ProductFormOption.module.css";

function ProductFormOption(props) {
  return (
    <div>
      <label>
        Label
        <input style={{ display: "block" }} />
      </label>
      <div className={styles.ClearFix}>
        <div
          style={{
            float: "left",
            fontWeight: "500",
            textTransform: "uppercase"
          }}
        >
          Options
        </div>
        <Button type="add" />
      </div>
    </div>
  );
}

export default ProductFormOption;
