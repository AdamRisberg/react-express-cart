import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../../api";
import { connect } from "react-redux";
import { addItem } from "../../redux/cart/cart-actions";

import ProductOption from "./ProductOption/ProductOption";
import ProductInfo from "./ProductInfo/ProductInfo";
import ProductDescription from "./ProductDescription/ProductDescription";
import ProductImages from "./ProductImages/ProductImages";
import Spinner from "../../shared-components/Spinner/Spinner";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Button from "../Button/Button";

import styles from "./Product.module.css";

class Product extends Component {
  state = {
    product: {},
    options: {},
    quantity: 1,
    loaded: false,
    notFound: false
  };

  componentDidMount() {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/products/" + this.props.match.params.id,
        { cancelToken: this.cancelGetRequest.token },
        false,
        false
      )
      .then(result => {
        if (!result.data) {
          return this.setState({ notFound: true });
        }
        this.setState({ ...result.data, loaded: true });
        window.scrollTo({ top: 0 });
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  handleInputChange = (id, price, value) => {
    const name = this.state.options[id].name;
    this.setState({
      options: { ...this.state.options, [id]: { price, value, name } }
    });
  };

  handleQuantityChange = e => {
    if (!e.target.value) return;

    this.setState({ quantity: parseInt(e.target.value, 10) });
  };

  calculateTotal() {
    const newTotal = Object.keys(this.state.options).reduce((acc, key) => {
      const price = this.state.options[key].price || 0;
      return acc + price;
    }, 0);

    return this.state.product.price + newTotal;
  }

  handleAddToCart = () => {
    const options = Object.keys(this.state.options).map(key => {
      return {
        optionID: key,
        price: this.state.options[key].price,
        value: this.state.options[key].value,
        name: this.state.options[key].name
      };
    });
    const item = {
      productID: this.state.product._id,
      optionsKey: JSON.stringify(this.state.options),
      name: this.state.product.name,
      image: this.state.product.images[0] || "",
      options,
      quantity: this.state.quantity,
      price: this.calculateTotal()
    };

    this.props.addToCart(item);
  };

  renderProductOptions() {
    return this.state.product.options.map(option => {
      return (
        <ProductOption
          styles={styles}
          key={option._id}
          {...option}
          value={this.state.options[option._id].value}
          inputChange={this.handleInputChange}
        />
      );
    });
  }

  render() {
    if (this.state.notFound) {
      return <Redirect to="/" />;
    }
    if (!this.state.loaded) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{`${this.state.product.name} - ${
            this.props.storeName
          }`}</title>
          <meta
            name="description"
            content={this.state.product.metaDescription}
          />
        </Helmet>
        <Breadcrumbs
          isProduct={true}
          pathname={this.state.product.path + "/" + this.state.product.name}
          categories={this.props.categories}
        />
        <div className={styles.Row}>
          <div className={styles.Column60}>
            <ProductImages images={this.state.product.images} />
          </div>
          <div className={styles.Column40}>
            <ProductInfo
              name={this.state.product.name}
              model={this.state.product.model}
              price={this.calculateTotal()}
            />
            {this.renderProductOptions()}
            <label className={styles.QuantityLabel}>
              Quantity
              <input
                type="number"
                min="1"
                className={styles.QuantityInput}
                onChange={this.handleQuantityChange}
                value={this.state.quantity}
              />
            </label>
            <Button
              text="Add to Cart"
              onClick={this.handleAddToCart}
              buttonStyle="Submit"
              bold
              size="WideLarge"
            />
          </div>
        </div>
        <ProductDescription info={this.state.product.info} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings, categories }) => ({
  storeName: settings.store_name,
  categories: categories.categories
});

const mapDispatchToProps = dispatch => ({
  addToCart: item => dispatch(addItem(item))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product);
