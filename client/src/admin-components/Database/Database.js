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
};

class Database extends Component {
  state = {
    backupLoading: false,
    restoreLoading: false,
  };

  imageInputRef = React.createRef();

  handleBackup = () => {
    this.setState({ backupLoading: true });

    api
      .get("/api/database", { responseType: "blob" }, true, true)
      .then((res) => {
        this.setState({ backupLoading: false });
        saveAs(res.data, "backup.zip");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleRestore = (e) => {
    e.preventDefault();

    this.setState({ restoreLoading: true });

    const file = this.imageInputRef.current.files[0];
    const data = new FormData();
    data.append("file", file, "backup.zip");

    api
      .post(
        "/api/database",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        true,
        true
      )
      .then((res) => {
        this.setState({ restoreLoading: false });
      });
  };

  render() {
    return (
      <div className={styles.Database}>
        <div className={styles.Group}>
          <div className={styles.Header}>
            <div className={styles.Title}>Backup</div>
          </div>
          <Button type="submit" style={buttonStyle} onClick={this.handleBackup}>
            Backup Store Data
          </Button>
        </div>
        <div className={styles.Group}>
          <div className={styles.Header}>
            <div className={styles.Title}>Restore</div>
          </div>
          <form onSubmit={this.handleRestore}>
            <label>
              Backup File
              <input ref={this.imageInputRef} type="file" />
            </label>
            <Button
              type="submit"
              style={buttonStyle}
              onClick={this.handleRestore}
            >
              Restore Store Data
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Database;
