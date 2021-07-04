import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../app-config";

const getUsers = async () => {
  try {
    const { data } = await axios.get(API_URL + "/users", {
      headers: {
        authorization: "Bearer " + localStorage.token,
      },
    });
    return data;
  } catch (err) {
    toast(err.toString());
  }
};

export { getUsers };
