import React, { Component } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

import styles from "./Footer.module.css";

class Footer extends Component {
  state = {
    links: []
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api.get("/api/footer/links", { cancelToken: this.cancelGetRequest.token }, false, false)
      .then(response => {
        this.setState(() => ({ links: response.data }));
      })
      .catch(err => {
        if(api.checkCancel(err)) {
          return;
        }
        console.log(err.response);
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  createColumns() {
    const numberOfLinks = this.state.links.length;
    const numberOfColumns = 4;

    let columnIdx = 0;
    const columns = new Array(numberOfColumns);
    for(let i = 0; i < numberOfColumns; i++) {
      columns[i] = [];
    }

    for(let i = 0; i < numberOfLinks; i++) {
      columns[columnIdx].push(this.state.links[i]);
      columnIdx++;
      if(columnIdx === numberOfColumns) {
        columnIdx = 0;
      }
    }
    return columns;
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.Footer}>
          <div className={`${styles.FooterContent} ${styles.Wrapper}`}>
            {this.createColumns().map((column, i) => {
              return (
                <div key={i} className={styles.List}>
                  <ul>
                    {column.map(link => {
                      return (
                        <li key={link.path} className={styles.ListItem}>
                          <Link to={"/" + link.path}>{link.title}</Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default Footer;