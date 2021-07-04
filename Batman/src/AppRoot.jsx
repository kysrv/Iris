import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

import App from "./Components/App";
import Auth from "./Components/Auth";
import NotFound from "./Components/NotFound";

class AppRoot extends Component {
  state = { user: {} };

  componentDidMount = () => {};

  render() {
    return (
      <React.Fragment>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="bg-black text-white w-screen h-screen overflow-auto font-mono p-2">
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/app" component={App} />

            <Route
              exact
              path="/"
              render={() => (
                <Link to="/auth">
                  <button className="rounded bg-green-400 p-2 text-lg">
                    Tester discord eco +
                  </button>
                </Link>
              )}
            />

            <Route path={"/"} render={NotFound} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default AppRoot;
