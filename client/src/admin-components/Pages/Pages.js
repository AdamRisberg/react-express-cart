import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import styles from "./Pages.module.css";

class Pages extends Component {
  state = {
    pages: [],
    loading: true
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/pages",
        { cancelToken: this.cancelGetRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ pages: res.data, loading: false }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
  }

  handleDeleteClick = () => {
    this.cancelDeleteRequest = api.getCancelTokenSource();

    const filteredPages = this.state.pages
      .filter(page => {
        return !!page.selected;
      })
      .map(page => page._id);

    api
      .post(
        "/api/pages/delete",
        filteredPages,
        { cancelToken: this.cancelDeleteRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ pages: res.data }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleAddClick = () => {
    this.cancelPostRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/pages",
        { page: {} },
        { cancelToken: this.cancelPostRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/page/" + res.data);
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleSelect = e => {
    const updatedPages = this.state.pages.map(page => {
      if (page._id === e.target.id) {
        page.selected = e.target.checked;
      }
      return page;
    });
    this.setState(() => ({ pages: updatedPages }));
  };

  handleEditClick = id => () => {
    this.props.history.push("/admin/page/" + id);
  };

  renderPages() {
    return this.state.pages.map(page => {
      return (
        <React.Fragment key={page._id}>
          <div className={styles.Page}>
            <Checkbox
              handleSelect={this.handleSelect}
              isChecked={page.selected}
              id={page._id}
            />
            <div className={styles.Name}>{page.title}</div>
            <Button type="edit" onClick={this.handleEditClick(page._id)} />
          </div>
        </React.Fragment>
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Info Pages</div>
          <Button type="delete" onClick={this.handleDeleteClick} />
          <Button type="add" onClick={this.handleAddClick} />
        </div>
        <div className={styles.PagesBox}>
          {this.state.pages.length ? (
            this.renderPages()
          ) : (
            <div className={styles.Page}>No pages found.</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Pages;
