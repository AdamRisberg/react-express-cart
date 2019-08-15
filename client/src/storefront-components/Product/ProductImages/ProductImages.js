import React, { Component } from "react";

import ProductImageModal from "../ProductImageModal/ProductImageModal";
import ImageLoader from "../../../shared-components/ImageLoader/ImageLoader";

import styles from "./ProductImages.module.css";

class ProductImages extends Component {
  state = {
    selectedIdx: 0,
    showModal: false
  };

  handleImageSelect = index => {
    if (index < 0 || index >= this.props.images.length) {
      return;
    }

    this.setState({
      selectedIdx: index,
      selectedImg: this.props.images[index]
    });
  };

  getPossibleDirections() {
    return {
      left: this.state.selectedIdx > 0,
      right: this.state.selectedIdx < this.props.images.length - 1
    };
  }

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
  };

  renderImages() {
    return this.props.images.map((img, i) => {
      return (
        <ImageLoader
          className={
            i === this.state.selectedIdx
              ? `${styles.PreviewImage} ${styles.SelectedPreview}`
              : styles.PreviewImage
          }
          key={i}
          imageName={img.src}
          path="/images/products/small/"
          alt={img.alt}
          onClick={() => this.handleImageSelect(i)}
        />
      );
    });
  }

  renderModal() {
    if (!this.state.showModal) {
      return null;
    }

    return (
      <ProductImageModal
        images={this.props.images}
        selectedIdx={this.state.selectedIdx}
        closeModal={this.toggleModal}
        handleImageSelect={this.handleImageSelect}
        directions={this.getPossibleDirections()}
      />
    );
  }

  render() {
    const image = this.props.images[this.state.selectedIdx] || {};

    return (
      <React.Fragment>
        {this.renderModal()}
        <div>
          <div className={styles.MainImageBox}>
            <ImageLoader
              className={styles.MainImage}
              path="/images/products/medium/"
              imageName={image.src}
              alt={image.alt}
              onClick={this.toggleModal}
            />
          </div>
          {this.renderImages()}
        </div>
      </React.Fragment>
    );
  }
}

export default ProductImages;
