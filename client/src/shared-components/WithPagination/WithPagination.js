import React, { Component } from "react";
import api from "../../api";
import { handleRequestError, handleAdminRequestError } from "../../utils";
import Pagination from "../Pagination/Pagination";
import Spinner from "../Spinner/Spinner";

class WithPagination extends Component {
  state = {
    items: [],
    fetchData: false,
    fetchUrl: "",
    page: 1,
    numPages: 1,
    loading: true,
    filter: "last30"
  };

  componentDidMount() {
    if (this.props.fetchUrl) {
      this.fetchData(false);
    }
  }

  componentWillUnmount() {
    this.cancelTokenSource && this.cancelTokenSource.cancel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.fetchData ||
      this.props.fetchUrl !== this.state.fetchUrl ||
      prevState.filter !== this.state.filter ||
      prevProps.refresh !== this.props.refresh
    ) {
      this.fetchData(!this.state.fetchData);
    }
  }

  fetchData = resetPage => {
    this.cancelTokenSource = api.getCancelTokenSource();

    this.setState({
      fetchData: false,
      fetchUrl: this.props.fetchUrl,
      loading: true
    });
    let url = this.props.fetchUrl + (resetPage ? 1 : this.state.page);

    if (this.state.filter && this.props.renderFilters) {
      url += `&filter=${this.state.filter}`;
    }

    if (this.props.limit) {
      url += `&limit=${this.props.limit}`;
    }

    api
      .get(
        url,
        { cancelToken: this.cancelTokenSource.token },
        this.props.fetchUseSession,
        this.props.fetchAdmin
      )
      .then(results => {
        const stateUpdate = {
          items: results.data.items,
          numPages: results.data.pages,
          loading: false
        };

        if (resetPage) {
          stateUpdate.page = 1;
        }

        this.setState(() => stateUpdate);
      })
      .catch(err => {
        if (this.props.isAdmin) {
          return handleAdminRequestError(this.props.flashErrorMessage, err);
        }
        handleRequestError(err);
      });
  };

  handleFilterChange = e => {
    const filter = e.target.value;
    this.setState(() => ({ filter }));
  };

  changePages = page => {
    if (this.state.page === page) return;

    this.setState(() => ({ page, fetchData: true }));
  };

  render() {
    return (
      <div style={{ minHeight: "1px" }}>
        {this.props.renderTitle
          ? this.props.renderTitle(this.state.items.length)
          : null}
        {this.state.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {this.props.renderFilters
              ? this.props.renderFilters(
                  this.state.filter,
                  this.handleFilterChange
                )
              : null}
            {this.props.renderItems(this.state.items)}
            {!this.props.disablePagination ? (
              <Pagination
                itemsLength={this.state.items.length}
                page={this.state.page}
                last={this.state.numPages}
                changePages={this.changePages}
              />
            ) : null}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default WithPagination;
