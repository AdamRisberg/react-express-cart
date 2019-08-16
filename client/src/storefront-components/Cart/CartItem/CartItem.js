import React, { Component } from "react";
import { Link } from "react-router-dom";

import Button from "../../Button/Button";
import ImageLoader from "../../../shared-components/ImageLoader/ImageLoader";

import styles from "./CartItem.module.css";

class CartItem extends Component {
  state = {
    quantity: this.props.quantity,
    needsUpdate: false
  };

  handleChange = e => {
    const quantity = parseInt(e.target.value, 10);
    const needsUpdate = quantity !== this.props.quantity;

    this.setState({ quantity, needsUpdate });
  };

  updateCart = () => {
    this.props.updateCart(
      this.props.productID,
      this.props.optionsKey,
      this.state.quantity
    );
    this.setState({ needsUpdate: false });
  };

  handleOnBlur = e => {
    if (!parseInt(e.target.value, 10)) {
      e.target.value = this.props.quantity;
      this.setState({ quantity: this.props.quantity, needsUpdate: false });
    }
  };

  render() {
    const lastOptionIdx = this.props.options.length - 1;

    return (
      <div className={styles.Row}>
        <div className={styles.RowContent}>
          <Link
            className={styles.ImageBox}
            to={`/product/${this.props.productID}`}
          >
            <ImageLoader
              className={styles.Image}
              path="/images/products/medium/"
              imageName={this.props.image.src}
              alt={this.props.image.alt}
            />
          </Link>
          <Link
            className={styles.Content}
            to={`/product/${this.props.productID}`}
          >
            <h4 className={styles.Title}>{this.props.name}</h4>
            {this.props.options.map((option, i) => {
              return (
                <React.Fragment key={option._id}>
                  <span className={styles.OptionName}>{`${i === 0 ? "" : " "}${
                    option.name
                  }: `}</span>
                  <span>{`${option.value}${
                    i !== lastOptionIdx ? "," : ""
                  }`}</span>
                </React.Fragment>
              );
            })}
            <div className={styles.Price}>{`$${this.props.price.toFixed(
              2
            )}`}</div>
          </Link>
        </div>
        <div className={styles.Controls}>
          <label className={styles.Label}>
            Qty:
            <input
              type="number"
              min="1"
              step="1"
              onBlur={this.handleOnBlur}
              onChange={this.handleChange}
              defaultValue={this.props.quantity}
            />
          </label>
          {this.state.needsUpdate ? (
            <Button text="Update" onClick={this.updateCart} noMargin />
          ) : null}
          <Button
            text="Remove"
            onClick={() =>
              this.props.removeFromCart(this.props._id, this.props.optionsKey)
            }
            buttonStyle="Cancel"
            float="Right"
            noMargin
          />
        </div>
      </div>
    );
  }
}

export default CartItem;
