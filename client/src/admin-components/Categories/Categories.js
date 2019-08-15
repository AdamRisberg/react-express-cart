import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import { flattenCategories } from "../../utils";

import styles from "./Categories.module.css";

class Categories extends Component {
  state = {
    categories: [],
    loading: true,
    editing: {},
    showForm: false,
    new: true
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/categories",
        { cancelToken: this.cancelGetRequest.token },
        false,
        true
      )
      .then(res => {
        const categories = flattenCategories(res.data);
        this.setState(() => ({ categories, loading: false }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
  }

  handleSelect = e => {
    const updatedCats = this.state.categories.map(cat => {
      if (cat._id === e.target.id) {
        cat.selected = e.target.checked;
      }
      return cat;
    });
    this.setState(() => ({ categories: updatedCats }));
  };

  handleDeleteClick = () => {
    this.cancelDeleteRequest = api.getCancelTokenSource();

    const filteredCats = this.state.categories
      .filter(cat => {
        return !!cat.selected;
      })
      .map(cat => cat._id);

    api
      .post(
        "/api/categories/delete",
        filteredCats,
        { cancelToken: this.cancelDeleteRequest.token },
        true,
        true
      )
      .then(res => {
        const categories = flattenCategories(res.data);
        this.setState(() => ({ categories }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleEditClick = id => () => {
    this.props.history.push("/admin/category/" + id);
  };

  handleAddClick = () => {
    this.cancelPostRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/categories",
        { category: {} },
        { cancelToken: this.cancelPostRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/category/" + res.data);
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  renderCategories() {
    return this.state.categories.map(cat => {
      return (
        <React.Fragment key={cat._id}>
          <div className={styles.Category}>
            <Checkbox
              handleSelect={this.handleSelect}
              isChecked={cat.selected}
              id={cat._id}
            />
            <div className={styles.Name}>{cat.htmlTitle}</div>
            <Button type="edit" onClick={this.handleEditClick(cat._id)} />
          </div>
        </React.Fragment>
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Categories</div>
          <Button type="delete" onClick={this.handleDeleteClick} />
          <Button type="add" onClick={this.handleAddClick} />
        </div>
        <div className={styles.CategoriesBox}>
          {this.state.categories.length ? (
            this.renderCategories()
          ) : (
            <div className={styles.Category}>No categories found.</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Categories;
