import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../app-config";
import { getCurrentUserInfo, loginUser } from "../../Services/userService";
import { getProfil } from "../../Services/discordAPI";
import {
  putTokenConnectionScriptToClipboard,
  randStr,
} from "../../Services/utils";
import {
  registerDiscordUser,
  verifyDiscordAccount,
} from "../../Services/discordAPI";
import API from "../../API";

const genEmail = async () => {
  try {
    const { data } = await axios.get(API_URL + "/tools/email", {
      headers: { Authorization: "azer " + localStorage.token },
    });
    return data.email;
  } catch (err) {
    return err;
  }
};

class Login extends Component {
  state = {
    data: {
      username: "Kysan",
      email: "",
      password: randStr(40),
      sitekey: "",
      register_hcaptcha_key: "",
      verify_hcaptcha_key: "",
      verify_hcaptcha_sitekey: "",
      token: "",
    },
    message: "",
  };

  componentDidMount = async () => {
    const { data } = this.state;
    const email = await genEmail();
    // alert(email);
    this.setState({ data: { ...data, email } }, () => {
      this.handleRegister();
    });
  };

  handleChange = ({ currentTarget: input }) => {
    const { data } = this.state;

    this.setState({ data: { ...data, [input.name]: input.value } });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
  };

  handleRegister = async () => {
    const { username, email, password, register_hcaptcha_key } =
      this.state.data;

    try {
      const {
        data: { token },
      } = await registerDiscordUser(
        username,
        email,
        password,
        register_hcaptcha_key
      );

      const accountStrInfo = await getProfil(token, password);

      this.setState({ data: { ...this.state.data, token } });

      putTokenConnectionScriptToClipboard(accountStrInfo, token);

      this.setState({
        message: accountStrInfo + " connection script copied to clipboard",
      });
      // initialisation de la phase de vérification du compte
      await this.handleVerify();
    } catch (err) {
      if (!err.response) return this.setState({ message: err.toString() });
      if (err.response.data.captcha_sitekey) {
        // si le problème viens du captcha
        this.setState({
          data: {
            ...this.state.data,
            sitekey: err.response.data.captcha_sitekey,
          },
        });
      } else {
        this.setState({
          message: err.response.data.message
            ? `${err.response.data.message} (${err.response.data.retry_after})`
            : JSON.stringify(err),
        });
      }
      return;
    }
  };

  handleVerify = async () => {
    const { username, email, password, register_hcaptcha_key, token } =
      this.state.data;

    const { data: verifToken } = await API.post("/tools/resolveDiscEmail", {
      email,
    });

    try {
      const res = await verifyDiscordAccount(token, verifToken);
      this.setState({
        message: `Account verified sucessfuly ! (${JSON.stringify(res.data)})`,
      });
    } catch (err) {
      if (err.response.data.captcha_sitekey) {
        // si le problème viens du captcha
        this.setState({
          data: {
            ...this.state.data,
            verify_hcaptcha_sitekey: err.response.data.captcha_sitekey,
          },
        });
      }
      // else {
      //   this.setState({
      //     message: err.response.data.message
      //       ? `error verifying : ${err.response.data.message} (${err.response.data.retry_after})`
      //       : JSON.stringify(err),
      //   });
      // }
    }
  };

  render() {
    const { path, url } = this.props.match;
    const {
      message,
      data: {
        email,
        password,
        username,
        sitekey,
        register_hcaptcha_key,
        verify_hcaptcha_sitekey,
      },
    } = this.state;
    return (
      <div className="w-full h-full flex flex-col items-center">
        <form
          className="w-full max-w-xs bg-gray-800 rounded p-5 space-y-5 flex flex-col items-center"
          onSubmit={this.handleSubmit}
        >
          <h1>DISCORD ACCOUNT GENERATOR</h1>
          <div>
            <div className="">
              <label htmlFor="username">username</label>
              <input
                name="username"
                className="bg-gray-500 rounded w-full"
                value={username}
                onChange={this.handleChange}
              />
            </div>
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
            <div className="">
              <label htmlFor="register_hcaptcha_key">hcaptcha token</label>
              <input
                name="register_hcaptcha_key"
                className="bg-gray-500 rounded w-full"
                value={register_hcaptcha_key}
                onChange={this.handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="sitekey">sitekey</label>
              <input
                name="sitekey"
                className="bg-gray-500 rounded w-full"
                value={sitekey}
                onChange={this.handleChange}
              />
            </div>
            <div>
              {sitekey != "" && (
                <HCaptcha
                  sitekey={sitekey}
                  onVerify={(token, ekey) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        register_hcaptcha_key: token,
                      },
                    })
                  }
                />
              )}
            </div>
          </div>
          <button
            className="rounded p-1 bg-red-600"
            onClick={this.handleRegister}
          >
            Generate
          </button>

          {verify_hcaptcha_sitekey != "" && (
            <div>
              <HCaptcha
                sitekey={verify_hcaptcha_sitekey}
                onVerify={(token, ekey) =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      verify_hcaptcha_sitekey: token,
                    },
                  })
                }
              />
              <button
                className="rounded p-1 bg-red-600"
                onClick={this.handleVerify}
              >
                Generate
              </button>
            </div>
          )}

          {message && (
            <div className="rounded bg-red-600 w-max h-min p-1"> {message}</div>
          )}
        </form>
      </div>
    );
  }
}

export default Login;
