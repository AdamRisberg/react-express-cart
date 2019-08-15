import React, { Component } from "react";
import api from "../../api";
import {
  handleAdminRequestErrorFull,
  handleAdminRequestError
} from "../../utils";
import { Redirect } from "react-router-dom";

import StateSelect from "../../shared-components/StateSelect/StateSelect";
import Button from "../Button/Button";
import Spinner from "../../shared-components/Spinner/Spinner";
import Images from "../Images/Images";

import styles from "./Settings.module.css";

class Settings extends Component {
  state = {
    loading: true,
    error: false
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/settings",
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        if (!res.data) throw new Error("No settings found.");
        this.setState(() => ({ settings: res.data, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ loading: false, error: true }));
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelImageDeleteRequest && this.cancelImageDeleteRequest.cancel();
    this.cancelImagePutRequest && this.cancelImagePutRequest.cancel();
    this.cancelPutRequest && this.cancelPutRequest.cancel();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.cancelPutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/settings",
        this.state.settings,
        { cancelToken: this.cancelPutRequest.token },
        true,
        true
      )
      .then(() => this.props.history.push("/admin"))
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleImageSelect = e => {
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file, `brand_image_${file.name}`);

    this.cancelImagePutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/settings/image?location=general",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          cancelToken: this.cancelImagePutRequest.token
        },
        true,
        true
      )
      .then(res =>
        this.setState(() => ({
          settings: {
            general: {
              ...this.state.settings.general,
              brand_image: res.data.general.brand_image
            },
            email: {
              ...this.state.settings.email
            }
          }
        }))
      )
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleDeleteImage = image => () => {
    this.cancelImageDeleteRequest = api.getCancelTokenSource();

    api
      .delete(
        `/api/settings/image?location=general&file=${image.src}`,
        { cancelToken: this.cancelImageDeleteRequest.token },
        true,
        true
      )
      .then(res => this.setState(() => ({ settings: res.data })))
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleCancel = () => {
    this.props.history.push("/admin");
  };

  handleInputChange = (key1, key2) => e => {
    const value = e.target.value;

    this.setState(() => ({
      settings: {
        ...this.state.settings,
        [key1]: {
          ...this.state.settings[key1],
          [key2]: value
        }
      }
    }));
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (this.state.error) {
      return <Redirect to="/admin" />;
    }

    const image = this.state.settings.general.brand_image
      ? [{ src: this.state.settings.general.brand_image, alt: "" }]
      : [];

    return (
      <React.Fragment>
        <form className={styles.Settings} onSubmit={this.handleSubmit}>
          <div className={styles.Header}>
            <div className={styles.Title}>Store</div>
          </div>
          <div className={styles.InputGroup}>
            <label>
              Store Name
              <input
                onChange={this.handleInputChange("general", "store_name")}
                value={this.state.settings.general.store_name}
              />
            </label>
            <label>
              Address 1
              <input
                onChange={this.handleInputChange("general", "address1")}
                value={this.state.settings.general.address1}
              />
            </label>
            <label>
              Address 2
              <input
                onChange={this.handleInputChange("general", "address2")}
                value={this.state.settings.general.address2}
              />
            </label>
            <label>
              City
              <input
                onChange={this.handleInputChange("general", "city")}
                value={this.state.settings.general.city}
              />
            </label>
            <StateSelect
              onChange={this.handleInputChange("general", "state")}
              value={this.state.settings.general.state}
            />
            <label>
              Zip
              <input
                onChange={this.handleInputChange("general", "zip")}
                value={this.state.settings.general.zip}
              />
            </label>
            <label>
              Phone
              <input
                onChange={this.handleInputChange("general", "phone")}
                value={this.state.settings.general.phone}
              />
            </label>
            <Images
              styles={{ marginBottom: "20px" }}
              onChangeImageOrder={() => {}}
              onImageSelection={this.handleImageSelect}
              onDeleteImage={this.handleDeleteImage}
              images={image}
              path="general"
              max={1}
            />
            <label>
              Meta Title
              <input
                onChange={this.handleInputChange("general", "meta_title")}
                value={this.state.settings.general.meta_title}
              />
            </label>
            <label>
              Meta Description
              <input
                onChange={this.handleInputChange("general", "meta_description")}
                value={this.state.settings.general.meta_description}
              />
            </label>
          </div>
          <div className={styles.Header}>
            <div className={styles.Title}>Email</div>
          </div>
          <div className={styles.InputGroup}>
            <label>
              SMTP Host
              <input
                onChange={this.handleInputChange("email", "smtp_host")}
                value={this.state.settings.email.smtp_host}
              />
            </label>
            <label>
              SMTP Port
              <input
                type="number"
                onChange={this.handleInputChange("email", "smtp_port")}
                value={this.state.settings.email.smtp_port}
              />
            </label>
            <label>
              Use TLS
              <select
                onChange={this.handleInputChange("email", "use_ssl")}
                value={this.state.settings.email.use_ssl}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </label>
            <label>
              Username
              <input
                onChange={this.handleInputChange("email", "username")}
                value={this.state.settings.email.username}
              />
            </label>
            <label>
              Email Address
              <input
                onChange={this.handleInputChange("email", "email_address")}
                value={this.state.settings.email.email_address}
              />
            </label>
          </div>
          <Button type="cancel" float="left" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button type="submit" float="right">
            SAVE
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default Settings;
