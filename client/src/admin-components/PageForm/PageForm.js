import React, { Component } from "react";
import api from "../../api";
import {
  handleAdminRequestErrorFull,
  handleAdminRequestError
} from "../../utils";
import { Redirect } from "react-router-dom";

import Button from "../Button/Button";
import Spinner from "../../shared-components/Spinner/Spinner";
import TextEditor from "../TextEditor/TextEditor";

import styles from "./PageForm.module.css";

class PageForm extends Component {
  state = {
    page: {
      title: "",
      content: "",
      path: ""
    },
    loading: true
  };

  componentDidMount() {
    const id = this.props.match.params.id;

    if (id) {
      this.fetchPage(id);
    } else {
      this.setState(() => ({ loading: false, page: null }));
    }
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelPutRequest && this.cancelPutRequest.cancel();
  }

  fetchPage(id) {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/pages/" + id,
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ page: res.data, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ page: null, loading: false }));
      });
  }

  handleFormSubmit = e => {
    e.preventDefault();
    this.cancelPutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/pages/" + this.state.page._id,
        { page: this.state.page },
        { cancelToken: this.cancelPutRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/pages");
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleChange = key => e => {
    let value;

    if (key === "content") {
      value = e;
    } else {
      value = e.target.value;
    }

    if (key === "path") {
      value = this.cleanPath(value);
    }

    this.setState(() => ({
      page: {
        ...this.state.page,
        [key]: value
      }
    }));
  };

  cleanPath(value) {
    let friendlyValue = value.replace(/ /g, "_").toLowerCase();
    friendlyValue = friendlyValue.replace(/[^a-z0-9_-]/gi, "");
    return friendlyValue;
  }

  handleCancel = () => {
    this.props.history.push("/admin/pages");
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.page) {
      return <Redirect to="/admin/pages" />;
    }

    return (
      <form onSubmit={this.handleFormSubmit} className={styles.PageForm}>
        <div className={styles.Header}>
          <div className={styles.Title}>Page</div>
        </div>
        <label>
          Title
          <input
            onChange={this.handleChange("title")}
            value={this.state.page.title}
          />
        </label>
        <label>
          Content
          <TextEditor
            id="editor"
            style={{ fontWeight: "400" }}
            onChange={this.handleChange("content")}
            text={this.state.page.content}
          />
        </label>
        <label>
          Path
          <input
            onChange={this.handleChange("path")}
            value={this.state.page.path}
          />
        </label>
        <label>
          Meta Description
          <input
            onChange={this.handleChange("metaDescription")}
            value={this.state.page.metaDescription}
          />
        </label>
        <Button type="cancel" float="left" onClick={this.handleCancel}>
          Cancel
        </Button>
        <Button type="submit" float="right">
          SAVE
        </Button>
      </form>
    );
  }
}

export default PageForm;
