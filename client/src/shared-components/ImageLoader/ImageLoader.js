import React from "react";

import styles from "./ImageLoader.module.css";

class ImageLoader extends React.Component {
  state = {
    loaded: false,
    error: false
  };

  componentDidUpdate(prevProps) {
    const lastImage = prevProps.path + prevProps.imageName;
    const currentImage = this.props.path + this.props.imageName;

    if (lastImage !== currentImage) {
      this.setState(() => ({ error: false }));
    }
  }

  onImageLoaded = () => {
    this.setState({ loaded: true });
  };

  onImageError = e => {
    e.preventDefault();
    this.setState({ error: true });
  };

  render() {
    let { imageName, path, alt, style, className, ...rest } = this.props;

    let src = path + imageName;

    if (this.state.error || !imageName || !path) {
      src = "/images/no-image.jpg";
      alt = "No preview";
    }

    const classes = [
      styles.Image,
      this.state.loaded ? styles.Show : "",
      className || ""
    ];

    return (
      <img
        style={style || {}}
        className={classes.join(" ")}
        alt={alt || ""}
        onLoad={this.onImageLoaded}
        onError={this.onImageError}
        {...rest}
        src={src}
      />
    );
  }
}

export default ImageLoader;
