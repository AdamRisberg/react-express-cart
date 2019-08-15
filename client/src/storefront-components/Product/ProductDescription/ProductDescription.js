import React, { Component } from "react";

import RenderHTML from "../../../shared-components/RenderHTML/RenderHTML";
import styles from "./ProductDescription.module.css";

class ProductDescription extends Component {
  state = {
    selectedIdx: 0
  };

  handleSelectionChange = idx => {
    if (this.state.selectedIdx === idx) {
      return;
    }
    this.setState({ selectedIdx: idx });
  };

  render() {
    const info = this.props.info;

    return (
      <div className={styles.ProductDescription}>
        <div className={`${styles.TitleRow} ${styles.Show}`}>
          {info.map((content, i) => {
            return (
              <div
                key={content.title}
                className={
                  i === this.state.selectedIdx
                    ? `${styles.TitleBox} ${styles.Selected}`
                    : styles.TitleBox
                }
                onClick={() => this.handleSelectionChange(i)}
              >
                {content.title}
              </div>
            );
          })}
        </div>
        {info.map((content, i) => {
          const lastStyle = i === info.length - 1 ? styles.Last : "";
          const showStyle = i !== this.state.selectedIdx ? styles.Hidden : "";

          return (
            <React.Fragment key={content.title}>
              <h4 className={`${styles.Title} ${styles.Hidden}`}>
                {content.title}
              </h4>
              <RenderHTML
                className={`${styles.DescriptionBox} ${showStyle} ${lastStyle}`}
                html={content.body}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default ProductDescription;
