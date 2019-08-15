import React, { Component } from "react";
import { SketchPicker } from "react-color";

import Button from "../../Button/Button";

import styles from "./OptionColorPicker.module.css";

class OptionColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: props.initialColor
    };
  }

  handleChange = color => {
    this.setState(() => ({ color }));
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.onChange(this.state.color);
    this.props.close();
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.Cover} onClick={this.props.close} />
        <div className={styles.ColorPickerBox}>
          <SketchPicker
            presetColors={[]}
            width={206}
            disableAlpha={true}
            className={styles.ColorPicker}
            onChangeComplete={this.handleChange}
            color={this.state.color}
          />
          <div className={`${styles.ColorButtons} ${styles.ClearFix}`}>
            <Button type="cancel" float="left" onClick={this.props.close}>
              Cancel
            </Button>
            <Button type="submit" float="right" onClick={this.handleSubmit}>
              SAVE
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default OptionColorPicker;
