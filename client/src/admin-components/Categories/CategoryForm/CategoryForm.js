import React, { Component } from "react";
import api from "../../../api";
import {
  handleAdminRequestErrorFull,
  handleAdminRequestError
} from "../../../utils";
import { Redirect } from "react-router-dom";

import Button from "../../Button/Button";
import CategorySelect from "../../CategorySelect/CategorySelect";
import Images from "../../Images/Images";
import Spinner from "../../../shared-components/Spinner/Spinner";

import { flattenCategories } from "../../../utils";

import styles from "./CategoryForm.module.css";

class CategoryForm extends Component {
  state = {
    category: {
      name: "",
      path: "",
      pathName: "",
      image: "",
      topLevel: true,
      parent: "",
      subcategories: [],
      metaDescription: "",
      order: ""
    },
    categories: [],
    loading: true,
    file: null
  };

  componentDidMount() {
    const catID = this.props.match.params.id;

    if (catID) {
      this.fetchCategory(catID);
    } else {
      this.setState(() => ({ loading: false }));
    }

    this.fetchAllCategories();
  }

  componentWillUnmount() {
    this.cancelGetAllRequest && this.cancelGetAllRequest.cancel();
    this.cancelGetRequest && this.cancelGetRequest.cancel();
    this.cancelPutRequest && this.cancelPutRequest.cancel();
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
    this.cancelImagePutRequest && this.cancelImagePutRequest.cancel();
  }

  fetchCategory(id) {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/categories/" + id,
        { cancelToken: this.cancelGetRequest.token },
        false,
        false
      )
      .then(res => {
        this.setState(() => ({ category: res.data, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ category: null, loading: false }));
      });
  }

  fetchAllCategories() {
    this.cancelGetAllRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/categories",
        { cancelToken: this.cancelGetAllRequest.token },
        false,
        false
      )
      .then(res => {
        const categories = flattenCategories(res.data);
        this.setState(() => ({ categories }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  handleFormSubmit = e => {
    e.preventDefault();
    this.cancelPutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/categories/" + this.state.category._id,
        { category: this.state.category },
        { cancelToken: this.cancelPutRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/categories");
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleDeleteImage = image => () => {
    this.cancelDeleteRequest = api.getCancelTokenSource();
    const categoryID = this.state.category._id;

    api
      .delete(
        `/api/categories/${categoryID}/image?location=categories&file=${
          image.src
        }`,
        { cancelToken: this.cancelDeleteRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({
          category: {
            ...this.state.category,
            image: res.data.image
          }
        }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleTextChange = key => e => {
    const value = e.target.value;

    this.setState(() => ({
      category: {
        ...this.state.category,
        [key]: value
      }
    }));
  };

  handleNameChange = e => {
    const value = e.target.value;
    const friendlyValue = this.cleanPathName(value);
    const path = this.createPath(friendlyValue);

    this.setState(() => ({
      category: {
        ...this.state.category,
        name: value,
        pathName: friendlyValue,
        path
      }
    }));
  };

  handlePathNameChange = e => {
    const value = e.target.value;
    const friendlyPathName = this.cleanPathName(value);
    const path = this.createPath(friendlyPathName);

    this.setState(() => ({
      category: {
        ...this.state.category,
        pathName: friendlyPathName,
        path
      }
    }));
  };

  createPath(pathName) {
    let path = this.state.category.path;
    let lastIdx = path.lastIndexOf("/");
    path = lastIdx < 0 ? pathName : path.substring(0, lastIdx + 1) + pathName;
    return path;
  }

  cleanPathName(value) {
    let friendlyValue = value.replace(/ /g, "_").toLowerCase();
    friendlyValue = friendlyValue.replace(/[^a-z0-9_-]/gi, "");
    return friendlyValue;
  }

  handleParentChange = e => {
    const value = e.target.value;
    const parentPath = this.getParentPath(value);
    const path = parentPath
      ? parentPath + "/" + this.state.category.pathName
      : this.state.category.pathName;

    this.setState(() => ({
      category: {
        ...this.state.category,
        parent: value,
        path,
        topLevel: !value
      }
    }));
  };

  getParentPath(parent) {
    let parentPath;

    const cats = this.state.categories;

    for (let i = 0; i < cats.length; i++) {
      if (cats[i]._id === parent) {
        parentPath = cats[i].path;
        break;
      }
    }
    return parentPath;
  }

  handleCancel = () => {
    this.props.history.push("/admin/categories");
  };

  handleImageSelect = e => {
    const categoryID = this.state.category._id;
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file, `${categoryID}-${file.name}`);

    this.cancelImagePutRequest = api.getCancelTokenSource();

    api
      .put(
        "/api/categories/" + categoryID + "/image?location=categories",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          cancelToken: this.cancelImagePutRequest.token
        },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({
          category: {
            ...this.state.category,
            image: res.data.image
          }
        }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.category) {
      return <Redirect to="/admin/categories" />;
    }

    const image = this.state.category.image
      ? [{ src: this.state.category.image, alt: "" }]
      : [];

    return (
      <form onSubmit={this.handleFormSubmit} className={styles.CategoryForm}>
        <div className={styles.Header}>
          <div className={styles.Title}>Category</div>
        </div>
        <label>
          Name
          <input
            onChange={this.handleNameChange}
            value={this.state.category.name}
          />
        </label>
        <label>
          Path Name
          <input
            onChange={this.handlePathNameChange}
            value={this.state.category.pathName}
          />
        </label>
        <label>
          Path
          <input value={this.state.category.path} disabled />
        </label>
        <Images
          styles={{ marginBottom: "20px" }}
          onChangeImageOrder={() => {}}
          onDeleteImage={this.handleDeleteImage}
          images={image}
          path="categories"
          onImageSelection={this.handleImageSelect}
          max={1}
        />
        <label>
          Parent
          <CategorySelect
            categories={this.state.categories}
            onChange={this.handleParentChange}
            value={this.state.category.parent}
          />
        </label>
        <label>
          Meta Description
          <input
            onChange={this.handleTextChange("metaDescription")}
            value={this.state.category.metaDescription}
          />
        </label>
        <label>
          Order
          <input
            onChange={this.handleTextChange("order")}
            defaultValue={
              this.state.category.order === "a" ? "" : this.state.category.order
            }
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

export default CategoryForm;
