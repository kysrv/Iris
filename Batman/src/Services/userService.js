import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../app-config";

const registerUser = async ({ username, email, password }) => {
  try {
    const { data } = await axios.post(API_URL + "/auth/register", {
      username,
      email,
      password,
    });

    return data;
  } catch (err) {
    toast(err.toString());
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const { data } = await axios.post(API_URL + "/auth/login", {
      email,
      password,
    });
    return data;
  } catch (err) {
    toast(err.toString());
  }
};

const getCurrentUserInfo = async () => {
  try {
    const { data } = await axios.get(API_URL + "/users/@me", {
      headers: {
        authorization: "Bearer " + localStorage.token,
      },
    });

    // * si token malformed ou invalid token/authorization syntax
    return !data.username ? null : data;
  } catch (err) {
    toast(err.toString());
  }
};

export { registerUser, loginUser, getCurrentUserInfo };
