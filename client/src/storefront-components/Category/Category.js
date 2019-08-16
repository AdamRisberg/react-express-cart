import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";

import CategoryPreview from "../CategoryPreview/CategoryPreview";
import Products from "../Products/Products";
import Spinner from "../../shared-components/Spinner/Spinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Pagination from "../../shared-components/Pagination/Pagination";
import Title from "../../shared-components/Title/Title";

import styles from "./Category.module.css";

class Category extends Component {
  state = {
    loading: true,
    notFound: false,
    catsPerPage: 8,
    page: 1,
    numPages: 1,
    fetchData: true
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    const path =
      this.props.location.pathname
        .split("/")
        .slice(2)
        .join("/") || "/";

    if (this.state.fetchData || path !== this.state.path) {
      this.fetchData(!this.state.fetchData);
    }
  }

  changePages = page => {
    if (this.state.page === page) return;

    this.setState(() => ({ page, fetchData: true }));
  };

  fetchData(resetPage) {
    this.setState({ loading: true, fetchData: false });

    const found = this.searchCategories(this.props.location.pathname);

    if (found) {
      const startIdx = (this.state.page - 1) * this.state.catsPerPage;

      const subcategories = found.subcategories.slice(
        startIdx,
        startIdx + this.state.catsPerPage
      );
      const numPages = Math.ceil(
        found.subcategories.length / this.state.catsPerPage
      );

      this.setState({
        ...found,
        subcategories,
        numPages,
        page: resetPage ? 1 : this.state.page,
        loading: false
      });
    } else {
      this.setState({ notFound: true });
    }
  }

  searchCategories(query) {
    let categories = [];

    if (this.props && this.props.categories) {
      categories = this.props.categories;
    }

    if (query === "/") {
      return {
        path: "/",
        name: "Categories",
        subcategories: categories
      };
    }

    function search(path, cats = categories) {
      if (!cats) return;

      for (let i = 0; i < cats.length; i++) {
        if (cats[i].path === path) return cats[i];
        let found = search(path, cats[i].subcategories);
        if (found) {
          return found;
        }
      }
    }

    const path = query
      .split("/")
      .slice(2)
      .join("/");
    return search(path);
  }

  hasSubcategories() {
    return this.state.subcategories && this.state.subcategories.length;
  }

  renderSubcategories() {
    if (!this.hasSubcategories()) return null;
    return (
      <div className={styles.SubcategoriesBox}>
        <div className={styles.Subcategories}>
          {this.state.subcategories.map(category => (
            <CategoryPreview key={category._id} category={category} />
          ))}
        </div>
        <Pagination
          itemsLength={this.state.subcategories.length}
          page={this.state.page}
          last={this.state.numPages}
          changePages={this.changePages}
        />
      </div>
    );
  }

  injectMetaData() {
    if (this.props.isHome) {
      return null;
    }

    return (
      <Helmet>
        <title>{`${this.state.name} - ${this.props.storeName}`}</title>
        <meta name="description" content={this.state.metaDescription} />
      </Helmet>
    );
  }

  render() {
    if (this.state.notFound) {
      return <Redirect to="/" />;
    }

    if (this.state.loading || this.props.loadingCategories) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        {this.injectMetaData()}
        {!this.props.isHome ? (
          <Breadcrumbs
            pathname={this.state.path}
            categories={this.props.categories}
          />
        ) : null}
        {!this.props.isHome ? (
          <Title text={this.state.name} underline centerOnMobile />
        ) : null}
        {this.renderSubcategories()}
        <Products
          categoryID={this.state._id}
          categoryPath={this.state.path}
          showTitle={this.hasSubcategories() && !this.props.isHome}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings, categories }) => ({
  storeName: settings.store_name,
  categories: categories.categories,
  loadingCategories: categories.loadingCategories
});

export default connect(mapStateToProps)(Category);
