import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../app-config";

const getPosts = async () => {
  try {
    const { data: posts } = await axios.get(API_URL + "/posts", {
      headers: {
        authorization: "Bearer " + localStorage.token,
      },
    });
    return posts;
  } catch (err) {
    toast(err.toString());
    return [];
  }
};

export { getPosts };
