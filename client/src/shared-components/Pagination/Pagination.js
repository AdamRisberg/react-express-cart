import React from "react";

import styles from "./Pagination.module.css";

const Pagination = props => {
  const spans = [];
  const pageRange = getPageRange(props.page, props.last);

  if (props.page > 1 && props.itemsLength) {
    spans.push(
      <span
        key={"left"}
        className={styles.Arrow}
        onClick={() => props.changePages(props.page - 1)}
      >
        &#60;
      </span>
    );
  }

  if (pageRange.truncateStart) {
    spans.push(
      <span
        key={`page${1}`}
        className={styles.Page}
        onClick={() => props.changePages(1)}
      >
        {1}
      </span>
    );
    spans.push(<span key={`page${2}`}>...</span>);
  }

  for (let i = pageRange.start; i <= pageRange.end; i++) {
    spans.push(
      props.page === i ? (
        <span key={`page${i}`} className={styles.Selected}>
          {i}
        </span>
      ) : (
        <span
          key={`page${i}`}
          className={styles.Page}
          onClick={() => props.changePages(i)}
        >
          {i}
        </span>
      )
    );
  }

  if (pageRange.truncateEnd) {
    spans.push(<span key={`page${props.last - 1}`}>...</span>);
    spans.push(
      <span
        key={`page${props.last}`}
        className={styles.Page}
        onClick={() => props.changePages(props.last)}
      >
        {props.last}
      </span>
    );
  }

  if (props.page < props.last) {
    spans.push(
      <span
        key={"right"}
        className={styles.Arrow}
        onClick={() => props.changePages(props.page + 1)}
      >
        &#62;
      </span>
    );
  }

  return spans.length > 1 ? <div className={styles.Pages}>{spans}</div> : null;
};

function getPageRange(page, last) {
  let start = Math.max(page - 3, 1);
  let end = Math.min(page + 3, last);

  while (Math.abs(start - end) < 6 && (start > 1 || end < last)) {
    if (start > 1) start--;
    else if (end < last) end++;
  }

  let truncateStart = false;
  let truncateEnd = false;

  if (start > 1) {
    start++;
    truncateStart = true;
  }
  if (end < last) {
    end--;
    truncateEnd = true;
  }

  return { start, end, truncateStart, truncateEnd };
}

export default Pagination;
