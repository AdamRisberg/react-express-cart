import React from "react";
import FlipMove from "react-flip-move";

import Icons from "../Icons/Icons";

import styles from "./Images.module.css";

const Images = ({
  images,
  onImageSelection,
  path,
  onChangeImageOrder,
  onDeleteImage,
  style = {},
  max = 10
}) => {
  return (
    <div style={style} className={styles.Images}>
      <div className={styles.Label}>{max === 1 ? "Image" : "Images"}</div>
      <div className={styles.ImagesContainer}>
        <FlipMove>
          {images.map((image, i) => {
            let imageSrc = image.src
              ? `/images/${path}/small/${image.src}`
              : `/images/no-image.jpg`;

            return (
              <div key={image._id + i} className={styles.ImageBox}>
                <img src={imageSrc} alt={image.alt} />
                {images.length > 1 ? (
                  <React.Fragment>
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={onChangeImageOrder(image, i - 1)}
                      className={styles.ArrowButton}
                    >
                      <Icons.LeftArrow />
                    </button>
                    <button
                      type="button"
                      onClick={onDeleteImage(image)}
                      className={styles.DeleteButton}
                    >
                      <Icons.Delete />
                    </button>
                    <button
                      type="button"
                      disabled={i === images.length - 1}
                      onClick={onChangeImageOrder(image, i + 1)}
                      className={styles.ArrowButton}
                    >
                      <Icons.RightArrow />
                    </button>
                  </React.Fragment>
                ) : (
                  <button
                    type="button"
                    onClick={onDeleteImage(image)}
                    className={styles.DeleteButton}
                    style={{ width: "100%" }}
                  >
                    <Icons.Delete />
                  </button>
                )}
              </div>
            );
          })}

          {images.length < max ? (
            <div className={`${styles.ImageBox} ${styles.FixedWidth}`}>
              <input
                id="image-picker"
                className={styles.HiddenFilePicker}
                type="file"
                accept="image/*"
                onChange={onImageSelection}
              />
              <label htmlFor="image-picker" style={{ cursor: "pointer" }}>
                <Icons.Image
                  style={{
                    fontSize: "36px",
                    display: "block",
                    margin: "0 auto 5px auto"
                  }}
                />
                Browse or drag image here
              </label>
            </div>
          ) : null}
        </FlipMove>
      </div>
    </div>
  );
};

export default Images;
