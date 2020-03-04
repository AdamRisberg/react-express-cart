import React, { Component } from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

import styles from "./Products.module.css";

class Products extends Component {
  state = {
    selected: {},
    allSelected: false,
    refresh: false
  };

  componentWillUnmount() {
    this.cancelDeleteRequest && this.cancelDeleteRequest.cancel();
    this.cancelPostRequest && this.cancelPostRequest.cancel();
  }

  handleSelect = e => {
    const id = e.target.id;
    const checked = e.target.checked;

    this.setState(() => ({
      selected: { ...this.state.selected, [id]: checked }
    }));
  };

  handleSelectAll = e => {
    const allSelected = e.target.checked;
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const selected = {};

    checkboxes.forEach(box => {
      if (box.id && box.id !== "ALL") {
        selected[box.id] = allSelected;
      }
    });
    this.setState(() => ({ selected, allSelected }));
  };

  handleDelete = () => {
    this.cancelDeleteRequest = api.getCancelTokenSource();
    const selected = Object.keys(this.state.selected).filter(
      key => this.state.selected[key]
    );

    api
      .post(
        "/api/products/delete",
        selected,
        { cancelToken: this.cancelDeleteRequest.token },
        true,
        true
      )
      .then(res => {
        this.setState(() => ({
          refresh: !this.state.refresh,
          selected: {},
          allSelected: false
        }));
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleAdd = () => {
    this.cancelPostRequest = api.getCancelTokenSource();

    api
      .post(
        "/api/products/",
        { info: [{ title: "Description", body: "" }] },
        { cancelToken: this.cancelPostRequest.token },
        true,
        true
      )
      .then(res => {
        this.props.history.push("/admin/product/" + res.data);
      })
      .catch(handleAdminRequestErrorFull(this.props.flashErrorMessage));
  };

  handleEdit = id => () => {
    this.props.history.push("/admin/product/" + id);
  };

  render() {
    return (
      <WithPagination
        isAdmin={true}
        flashErrorMessage={this.props.flashErrorMessage}
        fetchUrl="/api/products?page="
        refresh={this.state.refresh}
        renderTitle={() => (
          <div className={styles.TitleBox}>
            PRODUCTS
            <Button type="add" onClick={this.handleAdd} />
            <Button type="delete" onClick={this.handleDelete} />
          </div>
        )}
        renderItems={products => (
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    handleSelect={this.handleSelectAll}
                    isChecked={this.state.allSelected}
                    id="ALL"
                  />
                </th>
                <th className={styles.CollapseSmall}>Image</th>
                <th>Name</th>
                <th className={styles.Collapse}>Model</th>
                <th className={styles.Collapse}>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const image = {
                  src: "/images/no-image.jpg",
                  alt: "No preview"
                };

                if (product.images[0] && product.images[0].src) {
                  image.src = "/images/products/small/" + product.images[0].src;
                  image.alt = product.images[0].alt;
                }

                return (
                  <tr key={product._id}>
                    <td>
                      <Checkbox
                        handleSelect={this.handleSelect}
                        isChecked={this.state.selected[product._id]}
                        id={product._id}
                      />
                    </td>
                    <td className={styles.CollapseSmall}>
                      <img src={image.src} alt={image.alt} />
                    </td>
                    <td>{product.name}</td>
                    <td className={styles.Collapse}>{product.model}</td>
                    <td className={styles.Collapse}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td>
                      <Button
                        type="edit"
                        onClick={this.handleEdit(product._id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      />
    );
  }
}

export default Products;
