import React from "react";

import ImageLoader from "../../../shared-components/ImageLoader/ImageLoader";
import Modal from "../../Modal/Modal";

import styles from "./ProductImageModal.module.css";

const ProductImageModal = props => {
  let image = props.images[props.selectedIdx] || {};

  return (
    <Modal close={props.closeModal} modalType="image" buttonType="image">
      <React.Fragment>
        {props.directions.left ? renderLeftButton(props) : null}
        <ImageLoader
          className={styles.ModalImage}
          imageName={image.src}
          path="/images/products/"
          alt={image.alt}
        />
        {props.directions.right ? renderRightButton(props) : null}
      </React.Fragment>
    </Modal>
  );
};

function renderLeftButton(props) {
  return (
    <button
      className={styles.ButtonLeft}
      onClick={() => props.handleImageSelect(props.selectedIdx - 1)}
    >
      <div className={styles.LeftTriangle} />
    </button>
  );
}

function renderRightButton(props) {
  return (
    <button
      className={styles.ButtonRight}
      onClick={() => props.handleImageSelect(props.selectedIdx + 1)}
    >
      <div className={styles.RightTriangle} />
    </button>
  );
}

export default ProductImageModal;
