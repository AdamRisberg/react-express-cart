import React, { Component } from "react";
import api from "../../api";
import {
  handleAdminRequestErrorFull,
  handleAdminRequestError
} from "../../utils";
import { Redirect } from "react-router-dom";

import Spinner from "../../shared-components/Spinner/Spinner";
import CategorySelect from "../CategorySelect/CategorySelect";
import TextEditor from "../TextEditor/TextEditor";
import Images from "../Images/Images";
import Button from "../Button/Button";
import OptionColorPicker from "./OptionColorPicker/OptionColorPicker";

import { flattenCategories } from "../../utils";

import styles from "./ProductForm.module.css";

class ProductForm extends Component {
  state = {
    product: {
      name: "",
      model: "",
      featured: false,
      info: [],
      price: 0,
      images: [],
      options: [],
      metaDescription: ""
    },
    categories: [],
    loading: true,
    file: null
  };

  componentDidMount() {
    const productID = this.props.match.params.id;

    if (productID) {
      this.fetchProduct(productID);
    } else {
      this.setState(() => ({ loading: false }));
    }

    this.fetchCategories();
  }

  componentWillUnmount() {
    this.cancelDeleteReqeust && this.cancelDeleteReqeust.cancel();
    this.cancelGetCatsReqeust && this.cancelGetCatsReqeust.cancel();
    this.cancelGetProductReqeust && this.cancelGetProductReqeust.cancel();
    this.cancelPostProductReqeust && this.cancelPostProductReqeust.cancel();
    this.cancelPutImageReqeust && this.cancelPutImageReqeust.cancel();
    this.cancelPutProductReqeust && this.cancelPutProductReqeust.cancel();
  }

  fetchProduct(id) {
    this.cancelGetProductReqeust = api.getCancelTokenSource();

    api
      .get(
        `/api/products/${id}`,
        { cancelToken: this.cancelGetProductReqeust.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({ product: res.data.product, loading: false }));
      })
      .catch(err => {
        if (handleAdminRequestError(this.props.flashErrorMessage, err)) {
          return;
        }
        this.setState(() => ({ product: null, loading: false }));
      });
  }

  fetchCategories() {
    this.cancelGetCatsReqeust = api.getCancelTokenSource();

    api
      .get(
        "/api/categories",
        { cancelToken: this.cancelGetCatsReqeust.token },
        false,
        true
      )
      .then(res => {
        return flattenCategories(res.data);
      })
      .then(categories => {
        this.setState(() => ({ categories }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  handleInputChange = key => e => {
    const value = e.target.value;
    const stateChange = {
      [key]: value
    };

    if (key === "category") {
      const selectedIdx = e.target.selectedIndex;
      const options = document.querySelector("#category-select");
      stateChange.path = options[selectedIdx].dataset.path;
    }

    this.setState(() => ({
      product: {
        ...this.state.product,
        ...stateChange
      }
    }));
  };

  handleChangeImageOrder = (image, newIndex) => () => {
    if (newIndex < 0 || newIndex >= this.state.product.images.length) {
      return;
    }

    const images = this.state.product.images
      .map(img => ({ ...img }))
      .filter(img => img.src !== image.src);

    images.splice(newIndex, 0, { ...image });
    this.setState(() => ({
      product: {
        ...this.state.product,
        images
      }
    }));
  };

  handleImageSelect = e => {
    this.cancelPutImageReqeust = api.getCancelTokenSource();

    const productID = this.state.product._id;
    const file = e.target.files[0];

    const data = new FormData();
    data.append(
      "file",
      file,
      `${productID}-${this.state.product.images.length}-${file.name}`
    );

    api
      .put(
        "/api/products/" + productID + "/image?location=products",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          cancelToken: this.cancelPutImageReqeust.token
        },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({
          product: {
            ...this.state.product,
            images: res.data.images
          }
        }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleDeleteImage = image => () => {
    this.cancelDeleteReqeust = api.getCancelTokenSource();

    const productID = this.state.product._id;

    api
      .delete(
        `/api/products/${productID}/image?location=products&file=${image.src}`,
        { cancelToken: this.cancelDeleteReqeust.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({
          product: {
            ...this.state.product,
            images: res.data.images
          }
        }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleDeleteInfo = idx => () => {
    const info = this.state.product.info.slice();
    info.splice(idx, 1);

    this.setState(() => ({
      product: {
        ...this.state.product,
        info
      }
    }));
  };

  handleAddInfo = () => {
    const info = this.state.product.info.slice();
    info.push({ title: "", body: "" });

    this.setState(() => ({
      product: {
        ...this.state.product,
        info
      }
    }));
  };

  handleInfoTitleChange = idx => e => {
    const info = this.state.product.info.slice();
    info[idx].title = e.target.value;

    this.setState(() => ({
      product: {
        ...this.state.product,
        info
      }
    }));
  };

  handleInfoBodyChange = idx => value => {
    const info = this.state.product.info.map(cur => ({ ...cur }));
    info[idx].body = value;

    this.setState(() => ({
      product: {
        ...this.state.product,
        info
      }
    }));
  };

  handleFormSubmit = e => {
    e.preventDefault();

    if (this.state.product._id) {
      this.saveChanges();
    } else {
      this.saveNewProduct();
    }
  };

  saveChanges() {
    this.cancelPutProductReqeust = api.getCancelTokenSource();

    api
      .put(
        "/api/products/" + this.state.product._id,
        this.state.product,
        { cancelToken: this.cancelPutProductReqeust.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/products");
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  saveNewProduct() {
    this.cancelPostProductReqeust = api.getCancelTokenSource();

    api
      .post(
        "/api/products",
        this.state.product,
        { cancelToken: this.cancelPostProductReqeust.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/products");
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  }

  handleCancel = e => {
    this.props.history.push("/admin/products");
  };

  renderGeneral() {
    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Product</div>
        </div>

        <label>
          Name
          <input
            onChange={this.handleInputChange("name")}
            value={this.state.product.name}
          />
        </label>
        <label>
          Model
          <input
            onChange={this.handleInputChange("model")}
            value={this.state.product.model}
          />
        </label>
        <label>
          Price
          <input
            onChange={this.handleInputChange("price")}
            type="number"
            value={this.state.product.price}
          />
        </label>
        <label>
          Featured
          <select
            onChange={this.handleInputChange("featured")}
            value={this.state.product.featured}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </label>
        <label>
          Category
          <CategorySelect
            categories={this.state.categories}
            onChange={this.handleInputChange("category")}
            value={this.state.product.category}
          />
        </label>
        <label>
          Meta Description
          <textarea
            onChange={this.handleInputChange("metaDescription")}
            value={this.state.product.metaDescription}
          />
        </label>
        <Images
          style={{ marginBottom: "20px" }}
          onChangeImageOrder={this.handleChangeImageOrder}
          onDeleteImage={this.handleDeleteImage}
          images={this.state.product.images}
          path="products"
          onImageSelection={this.handleImageSelect}
        />
      </React.Fragment>
    );
  }

  renderInfoTabs() {
    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Product Info Tabs</div>
        </div>
        {this.state.product.info.map((info, i) => (
          <React.Fragment key={info._id + "" + i}>
            <div className={`${styles.SubHeader} ${styles.ClearFix}`}>
              <div className={styles.Subtitle}>
                Info Tab {this.state.product.info.length > 1 ? i + 1 : ""}
              </div>
              {i !== 0 ? (
                <Button
                  style={{
                    fontSize: ".9rem",
                    padding: "4px 8px",
                    boxShadow: "none"
                  }}
                  type="delete"
                  onClick={this.handleDeleteInfo(i)}
                />
              ) : null}
            </div>
            <div className={styles.InfoTab}>
              <label>
                Title
                <input
                  value={info.title}
                  onChange={this.handleInfoTitleChange(i)}
                />
              </label>
              <span className={styles.Label}>Body</span>
              <TextEditor
                text={info.body}
                onChange={this.handleInfoBodyChange(i)}
              />
            </div>
          </React.Fragment>
        ))}
        <div className={styles.Black}>
          <button
            type="button"
            className={styles.AddTab}
            onClick={this.handleAddInfo}
          >
            Add Info Tab
          </button>
        </div>
      </React.Fragment>
    );
  }

  handleOptionNameChange = optionIdx => e => {
    const value = e.target.value;

    const options = this.state.product.options.slice();
    options[optionIdx] = { ...options[optionIdx], label: value };

    this.setState(() => ({
      product: {
        ...this.state.product,
        options
      }
    }));
  };

  handleDeleteOption = optionIdx => () => {
    const options = this.state.product.options.slice();
    options.splice(optionIdx, 1);

    this.setState(() => ({
      product: {
        ...this.state.product,
        options
      }
    }));
  };

  handleAddOption = type => () => {
    const newOption = {
      label: "",
      optionType: type,
      options: []
    };

    this.setState(() => ({
      product: {
        ...this.state.product,
        options: [...this.state.product.options, newOption]
      }
    }));
  };

  handleAddOptionValue = (type, optionIdx) => () => {
    const newOptionValue = {
      label: "",
      price: 0,
      default: false
    };

    if (type === "colorRadio") {
      newOptionValue.color = "#000";
    }

    const options = this.state.product.options.slice();
    const optionValues = [...options[optionIdx].options, newOptionValue];
    options[optionIdx].options = optionValues;

    this.setState(() => ({
      product: {
        ...this.state.product,
        options
      }
    }));
  };

  renderProductOptions() {
    return (
      <React.Fragment>
        <div className={styles.Header}>
          <div className={styles.Title}>Product Options</div>
        </div>
        <div className={styles.AddOptionButtons}>
          <button type="button" onClick={this.handleAddOption("text")}>
            Text
          </button>
          <button type="button" onClick={this.handleAddOption("select")}>
            Select
          </button>
          <button type="button" onClick={this.handleAddOption("textRadio")}>
            Text Radio
          </button>
          <button type="button" onClick={this.handleAddOption("colorRadio")}>
            Color Radio
          </button>
        </div>
        {this.state.product.options.map((option, optionIdx) => (
          <React.Fragment key={option._id + "" + optionIdx}>
            <div className={`${styles.SubHeader} ${styles.ClearFix}`}>
              <div className={styles.Subtitle}>
                {optionTypeToLabel[option.optionType]} Option
              </div>
              <Button
                style={{
                  fontSize: ".9rem",
                  padding: "4px 8px",
                  boxShadow: "none"
                }}
                type="delete"
                onClick={this.handleDeleteOption(optionIdx)}
              />
            </div>
            <div className={styles.OptionBox}>
              <label className={styles.Underline}>
                Option Name
                <input
                  onChange={this.handleOptionNameChange(optionIdx)}
                  value={option.label}
                />
              </label>
              {option.options.map((optionValue, optionValueIdx) =>
                this.renderOptionValue(
                  option,
                  optionIdx,
                  optionValue,
                  optionValueIdx
                )
              )}
              {option.optionType !== "text" ? (
                <button
                  type="button"
                  className={styles.AddTab}
                  onClick={this.handleAddOptionValue(
                    option.optionType,
                    optionIdx
                  )}
                >
                  Add Option Value
                </button>
              ) : null}
            </div>
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  handleOptionValueChange = (key, optionIdx, optionValueIdx) => e => {
    if (e && e.preventDefault) e.preventDefault();

    let value;

    if (key === "price") {
      value = parseFloat(e.target.value);

      if (isNaN(value)) {
        value = this.state.product.options[optionIdx].options[optionValueIdx]
          .price;
      }
      e.target.value = value.toFixed(2);
    } else if (key === "color") {
      value = e.hex;
    } else {
      value = e.target.value;
    }

    const options = this.state.product.options.slice();
    const optionValues = options[optionIdx].options.slice();
    optionValues[optionValueIdx] = {
      ...optionValues[optionValueIdx],
      [key]: value
    };
    options[optionIdx].options = optionValues;

    this.setState(() => ({
      product: {
        ...this.state.product,
        options
      }
    }));
  };

  cleanHex(hex) {
    if (hex[0] !== "#") hex = "#" + hex;
    if (hex.length > 7) hex = hex.substring(0, 7);
    hex = hex.replace(/[^0-9a-f#]/gi, "");
    return hex;
  }

  handleDeleteOptionValue = (optionIdx, optionValueIdx) => () => {
    const options = this.state.product.options.slice();
    const optionValues = options[optionIdx].options.slice();
    optionValues.splice(optionValueIdx, 1);
    options[optionIdx].options = optionValues;

    this.setState(() => ({
      product: {
        ...this.state.product,
        options
      }
    }));
  };

  openCloseColorPicker = (optionIdx, optionValueIdx, open) => () => {
    const options = this.state.product.options.slice();
    const optionValues = options[optionIdx].options.slice();
    optionValues[optionValueIdx] = {
      ...optionValues[optionValueIdx],
      showPicker: open
    };
    options[optionIdx].options = optionValues;

    this.setState(() => ({
      product: {
        ...this.state.product,
        options
      }
    }));
  };

  renderOptionValue(option, optionIdx, optionValue, optionValueIdx) {
    return (
      <div
        key={optionValue._id + "" + optionValueIdx}
        className={styles.Underline}
      >
        <label>
          Option Value Name
          <input
            onChange={this.handleOptionValueChange(
              "label",
              optionIdx,
              optionValueIdx
            )}
            value={optionValue.label}
          />
        </label>
        {option.optionType === "colorRadio" ? (
          <div className={styles.ColorLabel} aria-label="Option Value Color">
            Option Value Color
            {optionValue.showPicker ? (
              <OptionColorPicker
                close={this.openCloseColorPicker(
                  optionIdx,
                  optionValueIdx,
                  false
                )}
                onChange={this.handleOptionValueChange(
                  "color",
                  optionIdx,
                  optionValueIdx
                )}
                initialColor={optionValue.color}
              />
            ) : (
              <button
                type="button"
                className={styles.ColorPreviewButton}
                onClick={this.openCloseColorPicker(
                  optionIdx,
                  optionValueIdx,
                  true
                )}
              >
                <div
                  style={{ backgroundColor: optionValue.color }}
                  className={styles.ColorPreview}
                />
              </button>
            )}
          </div>
        ) : null}
        {option.optionType !== "text" ? (
          <label>
            Option Value Price Adj.
            <input
              onBlur={this.handleOptionValueChange(
                "price",
                optionIdx,
                optionValueIdx
              )}
              type="number"
              defaultValue={optionValue.price.toFixed(2)}
            />
          </label>
        ) : null}
        <div className={styles.ClearFix}>
          <Button
            style={{
              fontSize: ".9rem",
              padding: "4px 8px",
              boxShadow: "none",
              marginBottom: "20px"
            }}
            type="cancel"
            onClick={this.handleDeleteOptionValue(optionIdx, optionValueIdx)}
          >
            Delete Option Value
          </Button>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (!this.state.product) {
      return <Redirect to="/admin/products" />;
    }

    return (
      <React.Fragment>
        <form className={styles.ProductForm} onSubmit={this.handleFormSubmit}>
          {this.renderGeneral()}
          {this.renderInfoTabs()}
          {this.renderProductOptions()}
          <div className={styles.ClearFix}>
            <Button type="cancel" float="left" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button type="submit" float="right" onClick={this.handleFormSubmit}>
              SAVE
            </Button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

const optionTypeToLabel = {
  text: "Text",
  select: "Select",
  textRadio: "Radio",
  colorRadio: "Color Radio"
};

export default ProductForm;
