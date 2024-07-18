import axios from "axios";
// pre pending local host so got rid of it
const BASE_URL = ""; //process.env.REACT_DEV_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
