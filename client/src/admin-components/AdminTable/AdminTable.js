import React from "react";

import styles from "./AdminTable.module.css";

export const Table = React.forwardRef(({ children }, ref) => {
  return (
    <table ref={ref} className={styles.AdminTable}>
      {children}
    </table>
  );
});

export const Head = ({ children }) => <thead>{children}</thead>;

export const HeadRow = ({ children }) => <tr>{children}</tr>;

export const HeadCell = ({ collapse = "none", align = "left", children }) => (
  <th className={`${styles[`collapse-${collapse}`]} ${styles[align]}`}>
    {children}
  </th>
);

export const Body = ({ children }) => <tbody>{children}</tbody>;

export const Row = ({ children }) => <tr>{children}</tr>;

export const Cell = ({
  collapse = "none",
  align = "left",
  colSpan = 1,
  children
}) => (
  <td
    colSpan={colSpan}
    className={`${styles[`collapse-${collapse}`]} ${styles[align]}`}
  >
    {children}
  </td>
);

export const TitleBox = ({ children }) => (
  <div className={styles.TitleBox}>{children}</div>
);
