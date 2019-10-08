import React from "react";

import styles from "./Icon.module.css";

const Add = () => {
  return (
    <svg
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z" />
    </svg>
  );
};

const Delete = ({ className, ...props }) => {
  return (
    <svg
      {...props}
      className={`${styles.Icon} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z" />
      <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z" />
    </svg>
  );
};

const Edit = () => {
  return (
    <svg
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z" />
    </svg>
  );
};

const View = () => {
  return (
    <svg
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M16 6c-8.837 0-16 10-16 10s7.163 10 16 10 16-10 16-10-7.163-10-16-10zM16 22c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6zM16 12c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z" />
    </svg>
  );
};

const Exit = () => {
  return (
    <svg
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z" />
    </svg>
  );
};

const Image = ({ ...props }) => {
  return (
    <svg
      {...props}
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M29.996 4c0.001 0.001 0.003 0.002 0.004 0.004v23.993c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993zM30 2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2v0z" />
      <path d="M26 9c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
      <path d="M28 26h-24v-4l7-12 8 10h2l7-6z" />
    </svg>
  );
};

const LeftArrow = ({ ...props }) => {
  return (
    <svg
      {...props}
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M1 16l15 15v-9h16v-12h-16v-9z" />
    </svg>
  );
};

const RightArrow = ({ ...props }) => {
  return (
    <svg
      {...props}
      className={styles.Icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
    >
      <path d="M31 16l-15-15v9h-16v12h16v9z" />
    </svg>
  );
};

export default { Add, Delete, Edit, View, Exit, Image, LeftArrow, RightArrow };
