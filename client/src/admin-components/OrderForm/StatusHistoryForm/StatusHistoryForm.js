import React from "react";

import Button from "../../Button/Button";

import styles from "./StatusHistoryForm.module.css";

const StatusHistoryForm = ({
  status,
  notified,
  tracking,
  comment,
  onSubmit,
  onChange
}) => {
  return (
    <React.Fragment>
      <div className={styles.TitleBox}>ADD STATUS HISTORY</div>
      <div className={styles.ContentBox}>
        <form onSubmit={onSubmit}>
          <label>
            Order Status
            <select onChange={onChange("status")} value={status}>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Backorder</option>
              <option>Cancelled</option>
              <option>Refunded</option>
            </select>
          </label>
          <label>
            Notify Customer
            <select onChange={onChange("notified")} value={notified}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
          <label>
            Tracking Number(s)
            <input
              onChange={onChange("tracking")}
              value={tracking}
              placeholder="Comma separated list"
            />
          </label>
          <label>
            Comments
            <textarea onChange={onChange("comment")} value={comment} rows={5} />
          </label>
          <Button style={{ padding: "6px 30px" }} type="submit">
            ADD
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default StatusHistoryForm;
