import React from "react";
import { formatDateShort } from "../../../utils";

import styles from "./StatusHistory.module.css";

const StatusHistory = ({ history }) => {
  return (
    <div className={styles.StatusHistory}>
      <div className={styles.TitleBox}>ORDER HISTORY</div>
      <div className={styles.HistoryContent}>
        {history.map((h, i) => {
          return (
            <div key={h._id + i.toString()} className={styles.HistoryItem}>
              <div>
                <span className={styles.Bold}>Date: </span>
                {formatDateShort(h.date)}
              </div>
              <div>
                <span className={styles.Bold}>Status: </span>
                {h.status}
              </div>
              <div>
                <span className={styles.Bold}>Notified: </span>
                {h.notified}
              </div>
              <div>
                <span className={styles.Bold}>Tracking: </span>
                {h.tracking.length ? h.tracking.join(", ") : "None"}
              </div>
              <div>
                <span className={styles.Bold}>Comments: </span>
                {h.comment ? h.comment : "None"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusHistory;
