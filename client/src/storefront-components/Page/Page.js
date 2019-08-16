import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import api from "../../api";

import RenderHTML from "../../shared-components/RenderHTML/RenderHTML";
import Spinner from "../../shared-components/Spinner/Spinner";
import Title from "../../shared-components/Title/Title";

class Page extends Component {
  state = {
    title: "",
    content: "",
    notFound: false,
    loading: true
  };

  componentDidMount() {
    const route = this.props.match.url.substring(1);
    this.fetchData(route);
  }

  componentWillUnmount() {
    this.cancelGetRequest && this.cancelGetRequest.cancel();
  }

  componentDidUpdate() {
    const route = this.props.match.url.substring(1);
    if (!this.state.loading && this.state.path !== route) {
      this.setState(() => ({ loading: true }));
      this.fetchData(route);
    }
  }

  fetchData(path) {
    this.cancelGetRequest = api.getCancelTokenSource();

    api
      .get(
        "/api/pages/path/" + path,
        { cancelToken: this.cancelGetRequest.token },
        false,
        false
      )
      .then(response => {
        if (response.data) {
          this.setState(() => ({
            title: response.data.title,
            content: response.data.content,
            path: response.data.path,
            metaDescription: response.data.metaDescription,
            loading: false
          }));
        } else {
          throw new Error("Not Found");
        }
      })
      .catch(err => {
        if (api.checkCancel(err)) {
          return;
        }
        console.log(err);
        this.setState(() => ({ notFound: true, loading: false }));
      });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    if (this.state.notFound) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>{`${this.state.title} - ${this.props.storeName}`}</title>
          <meta name="description" content={this.state.metaDescription} />
        </Helmet>
        <Title text={this.state.title} underline />
        <RenderHTML html={this.state.content} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ settings }) => ({
  storeName: settings.store_name
});

export default connect(mapStateToProps)(Page);
