import React from "react";
import styles from "./Title.module.css";

const Title = ({ underline, text, centerOnMobile, centerOn500, center }) => {
  const underlineStyle = underline ? styles.Underline : "";
  const alignStyle = centerOn500
    ? styles.centerOn500
    : centerOnMobile
    ? styles.CenterOnMobile
    : center
    ? styles.Center
    : "";

  return (
    <h1 className={`${styles.Title} ${underlineStyle} ${alignStyle}`}>
      {text}
    </h1>
  );
};

export default Title;
