import React from "react";
import Markdown from "markdown-to-jsx";

import styles from "./RenderHTML.module.css";

const RenderHTML = ({ html, className }) => {
  return (
    <div className={className}>
      <Markdown
        className={styles.RenderHTML}
        children={html}
        options={{
          overrides: {
            p: {
              component: "div"
            },
            br: {
              component: "div"
            }
          }
        }}
      />
    </div>
  );
};

export default RenderHTML;
