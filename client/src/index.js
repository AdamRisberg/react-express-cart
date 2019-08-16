import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import Storefront from "./Storefront";
import Admin from "./Admin";

import "./index.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/" component={Storefront} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
