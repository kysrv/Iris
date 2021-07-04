import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../app-config";
import Avatar from "../NavBar/Avatar";
import { Link } from "react-router-dom";

const UserCard = ({ username, accountCreationDate, pp, _id }) => {
  return (
    <div className="flex flex-col bg-blue-800 w-64 h-32 p-2 rounded flex flex-row items-center">
      <Link to={"/app/users/" + _id} className="text-red-500 text-lg">
        {username}
      </Link>
      <img src={pp} className="rounded-full w-16 h-16" />
    </div>
  );
};

class Users extends Component {
  async componentDidMount() {
    this.props.handleUsersUpdate();
  }

  render() {
    console.log(this.props.users);
    return (
      <div className="h-full w-full items-center justify-center overflow-y-scroll flex flex-wrap gap-4">
        {this.props.users.map((user) => (
          <UserCard key={user._id} {...user} />
        ))}
      </div>
    );
  }
}

export default Users;
