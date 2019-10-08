import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import SearchIcon from "../../../shared-components/icons/SearchIcon/SearchIcon";

import styles from "./SearchBox.module.css";

class SearchBox extends Component {
  state = {
    query: ""
  };

  handleSearchChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSearch = e => {
    e.preventDefault();
    e.target.lastChild.firstChild.blur();

    this.props.history.push(`/search?query=${encodeURI(this.state.query)}`);
    this.setState({ query: "" });
  };

  render() {
    return (
      <form className={styles.SearchBox} onSubmit={this.handleSearch}>
        <div className={styles.Wrapper}>
          <input
            aria-label="Search Box"
            className={styles.SearchInput}
            value={this.state.query}
            onChange={this.handleSearchChange}
          />
          <button className={styles.SearchButton}>
            <SearchIcon />
          </button>
        </div>
      </form>
    );
  }
}

export default withRouter(SearchBox);
