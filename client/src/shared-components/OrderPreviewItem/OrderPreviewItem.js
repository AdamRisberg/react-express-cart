import React from "react";
import { Link } from "react-router-dom";

import ImageLoader from "../ImageLoader/ImageLoader";

import styles from "./OrderPreviewItem.module.css";

const OrderPreviewItem = props => {
  const lastOptionIdx = props.options.length - 1;

  return (
    <div className={styles.OrderPreviewItem}>
      <Link className={styles.ImageBox} to={`/product/${props.productID}`}>
        <ImageLoader
          className={styles.Image}
          imageName={props.image.src}
          path="/images/products/medium/"
          alt={props.image.alt}
        />
      </Link>
      <Link className={styles.Content} to={`/product/${props.productID}`}>
        <h4 className={styles.Title}>{props.name}</h4>
        {props.options.map((option, i) => {
          return (
            <span key={option._id}>
              {option.name}: {option.value}
              {i !== lastOptionIdx ? ", " : ""}
            </span>
          );
        })}
        <div className={styles.Price}>{`$${props.price.toFixed(2)}`}</div>
      </Link>
      <div className={styles.Quantity}>Qty: {props.quantity}</div>
    </div>
  );
};

export default OrderPreviewItem;
