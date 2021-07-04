import axios from "axios";
import React, { Component } from "react";
import API from "../../API";

class Test extends Component {
  state = {};

  componentDidMount = async () => {};

  handleTest = async () => {
    API.post("/channels/create");
  };

  render() {
    return (
      <div>
        <button onClick={this.handleTest}>Test !</button>
      </div>
    );
  }
}

export default Test;
