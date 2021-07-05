import React, { Component } from "react";

class Exemple extends Component {
  state = {
    date: {
      username: "Kysan",
    },
  };
  render() {
    return <div>{this.state.username}</div>;
  }
}

export default MyProfile;
