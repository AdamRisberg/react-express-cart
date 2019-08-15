import React from "react";
import ReactQuill from "react-quill";

import styles from "../../shared-components/RenderHTML/RenderHTML.module.css";

import "./quill.snow.css";

const TextEditor = props => {
  return (
    <ReactQuill
      className={styles.RenderHTML}
      modules={ReactQuill.modules}
      value={props.text}
      onChange={props.onChange}
      {...props}
    />
  );
};

var toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic"],
  [{ list: "ordered" }, { list: "bullet" }]
];

ReactQuill.modules = {
  toolbar: toolbarOptions
};

export default TextEditor;
