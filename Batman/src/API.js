import axios, { AxiosRequestConfig } from "axios";
import { API_URL } from "./app-config";


const getToken = () => `User ${localStorage.token}`

const config = {
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json; charset=utf-8', Accept: 'application/json' },
  transformRequest: [(data, headers) => {
    // * pour mettre à jours le token à chaque requête
    headers['Authorization'] = getToken()
    return JSON.stringify(data);
  }],
};



const API = axios.create(config);
export default API;
