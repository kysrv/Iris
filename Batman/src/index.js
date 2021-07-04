import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppRoot from "./AppRoot";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <AppRoot />
  </BrowserRouter>,
  document.getElementById("root")
);
