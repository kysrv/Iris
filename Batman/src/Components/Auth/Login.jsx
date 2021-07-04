import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getCurrentUserInfo, loginUser } from "../../Services/userService";

class Login extends Component {
  state = {
    data: { email: "", password: "" },
    apiResponse: "",
  };
  componentDidMount = () => {
    this.checkIfAlreadyLoggedIn();
  };

  checkIfAlreadyLoggedIn = async () => {
    const user = await getCurrentUserInfo();
    if (user != null) {
      this.props.history.push("/app");
    }
  };

  handleChange = ({ currentTarget: input }) => {
    const { data } = this.state;

    this.setState({ data: { ...data, [input.name]: input.value } });
  };

  handleLoginSuccess = () => {
    setTimeout(() => {
      this.props.history.push("/app");
    }, 2000);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(this.state.data);

    if (res.error) {
      this.setState({ apiResponse: res.error });
    } else {
      this.setState({ apiResponse: "Login success" }, this.handleLoginSuccess);

      console.log(res);
      localStorage.token = res.token;
    }
  };

  render() {
    const { path, url } = this.props.match;
    const {
      apiResponse,
      data: { email, password },
    } = this.state;
    return (
      <form
        className="w-full max-w-xs h-full bg-gray-800 rounded p-5 space-y-5"
        onSubmit={this.handleSubmit}
      >
        <h1>LOGIN</h1>
        <div>
          <div className="">
            <label htmlFor="email">email</label>
            <input
              name="email"
              className="bg-gray-500 rounded w-full"
              value={email}
              onChange={this.handleChange}
            />
          </div>
          <div className="">
            <label htmlFor="password">password</label>
            <input
              name="password"
              type="password"
              className="bg-gray-500 rounded w-full"
              value={password}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <button className="rounded p-1 bg-red-600">Login</button>
        <div>
          Didn't have an account ? <Link to="/auth/register">register</Link>
        </div>

        {apiResponse && (
          <div className="rounded bg-red-600 w-max h-min p-1">
            {" "}
            {apiResponse}
          </div>
        )}
      </form>
    );
  }
}

export default Login;
