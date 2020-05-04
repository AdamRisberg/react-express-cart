import React, { Component } from "react";
import { saveAs } from "file-saver";
import api from "../../api";

import Spinner from "../../shared-components/Spinner/Spinner";
import Button from "../Button/Button";

import styles from "./Database.module.css";

const buttonStyle = {
  float: "none",
  marginLeft: "0",
  padding: "10px 20px",
  display: "flex"
};

class Database extends Component {
  state = {
    backupLoading: false,
    restoreLoading: false,
    backupSuccess: false,
    restoreSuccess: false
  };

  imageInputRef = React.createRef();

  handleBackup = () => {
    this.setState({ backupLoading: true, backupSuccess: false });

    api
      .get("/api/database", { responseType: "blob" }, true, true)
      .then(res => {
        saveAs(res.data, "backup.zip");
        this.setState({ backupLoading: false, backupSuccess: true });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleRestore = e => {
    e.preventDefault();

    const file = this.imageInputRef.current.files[0];

    if (!file) {
      return;
    }

    this.setState({ restoreLoading: true, restoreSuccess: false });

    const data = new FormData();
    data.append("file", file, "backup.zip");

    api
      .post(
        "/api/database",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }
        },
        true,
        true
      )
      .then(res => {
        this.setState({ restoreLoading: false, restoreSuccess: true });
      });
  };

  render() {
    const {
      backupLoading,
      restoreLoading,
      backupSuccess,
      restoreSuccess
    } = this.state;

    return (
      <div className={styles.Database}>
        <div className={styles.Group}>
          <div className={styles.Header}>
            <div className={styles.Title}>Backup</div>
          </div>
          <Button
            disabled={backupLoading}
            type="submit"
            style={buttonStyle}
            onClick={this.handleBackup}
          >
            {backupLoading ? (
              <React.Fragment>
                Backup Up Data...
                <Spinner style={{ marginLeft: "10px", fontSize: "1rem" }} />
              </React.Fragment>
            ) : (
              "Backup Store Data"
            )}
          </Button>
          {backupSuccess && (
            <div className={styles.success}>
              Backup successful. Download will begin shortly...
            </div>
          )}
        </div>
        <div className={styles.Group}>
          <div className={styles.Header}>
            <div className={styles.Title}>Restore</div>
          </div>
          <form onSubmit={this.handleRestore}>
            <label>
              Backup File
              <input
                ref={this.imageInputRef}
                disabled={restoreLoading}
                type="file"
              />
            </label>
            <Button
              disabled={restoreLoading}
              type="submit"
              style={buttonStyle}
              onClick={this.handleRestore}
            >
              {restoreLoading ? (
                <React.Fragment>
                  Restoring Data...
                  <Spinner style={{ marginLeft: "10px", fontSize: "1rem" }} />
                </React.Fragment>
              ) : (
                "Restore Store Data"
              )}
            </Button>
            {restoreSuccess && (
              <div className={styles.success}>Data restored successfully.</div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default Database;
