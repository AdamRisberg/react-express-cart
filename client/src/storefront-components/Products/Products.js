import React, { Component } from "react";

import ProductPreview from "../ProductPreview/ProductPreview";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Title from "../../shared-components/Title/Title";

import styles from "./Products.module.css";

class Products extends Component {
  state = {
    fetchUrl: ""
  };

  static defaultProps = {
    location: {}
  };

  componentDidMount() {
    this.setLocation();
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.categoryID === this.props.categoryID &&
      prevProps.location.search === this.props.location.search
    )
      return;

    this.fetchProducts();
  }

  setLocation() {
    this.isSearch = !!this.props.location.search;
    this.isHome = !this.props.categoryID && !this.isSearch;
    this.isCategory = !this.isSearch && !this.isHome;
  }

  fetchProducts() {
    let url = "";

    if (this.isSearch) {
      const query = this.props.location.search.substring(7);
      url = `/api/products?search=${query}&page=`;
    } else if (this.isHome) {
      url = `/api/products/featured?page=`;
    } else {
      url = `/api/products/category?category=${this.props.categoryID}&path=${
        this.props.categoryPath
      }&page=`;
    }

    this.setState({ fetchUrl: url });
  }

  renderProducts(items) {
    if (items.length) {
      return items.map(product => (
        <ProductPreview key={product._id} product={product} />
      ));
    } else {
      return null;
    }
  }

  renderSearchTitle() {
    const query = decodeURI(this.props.location.search.substring(7));
    return (
      <React.Fragment>
        <Breadcrumbs isProduct={true} pathname={`Search: "${query}"`} />
        <Title text={`"${query}"`} underline centerOnMobile />
      </React.Fragment>
    );
  }

  renderHomeTitle() {
    return <Title text="Featured Products" underline centerOnMobile />;
  }

  renderNone() {
    return (
      <div className={styles.None}>
        {this.isSearch
          ? "No results found."
          : !this.props.showTitle && !this.isHome
          ? "Coming soon!"
          : ""}
      </div>
    );
  }

  render() {
    return (
      <WithPagination
        fetchUrl={this.state.fetchUrl}
        renderTitle={listLength => (
          <React.Fragment>
            {this.isHome && listLength ? this.renderHomeTitle() : null}
            {this.isSearch ? this.renderSearchTitle() : null}
            {this.props.showTitle && listLength ? (
              <div className={styles.Line} />
            ) : null}
          </React.Fragment>
        )}
        renderItems={items => (
          <div className={styles.ProductsBox}>
            {this.renderProducts(items) || this.renderNone()}
          </div>
        )}
      />
    );
  }
}

export default Products;
