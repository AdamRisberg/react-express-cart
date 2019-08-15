import React from "react";

import ImageLoader from "../../../shared-components/ImageLoader/ImageLoader";

import styles from "./ProductImageModal.module.css";

const ProductImageModal = props => {
  let image = props.images[props.selectedIdx] || {};

  return (
    <div
      className={styles.Modal}
      onClick={e => handleCloseClick(e, props.closeModal)}
    >
      <div className={styles.ModalContent}>
        <div className={styles.CloseButton} onClick={props.closeModal} />
        {props.directions.left ? renderLeftButton(props) : null}
        <ImageLoader
          className={styles.ModalImage}
          imageName={image.src}
          path="/images/products/"
          alt={image.alt}
        />
        {props.directions.right ? renderRightButton(props) : null}
      </div>
    </div>
  );
};

function renderLeftButton(props) {
  return (
    <div
      className={styles.ButtonLeft}
      onClick={() => props.handleImageSelect(props.selectedIdx - 1)}
    >
      <div className={styles.LeftTriangle} />
    </div>
  );
}

function renderRightButton(props) {
  return (
    <div
      className={styles.ButtonRight}
      onClick={() => props.handleImageSelect(props.selectedIdx + 1)}
    >
      <div className={styles.RightTriangle} />
    </div>
  );
}

function handleCloseClick(e, cb) {
  if (e.target === e.currentTarget) {
    cb();
  }
}

export default ProductImageModal;
