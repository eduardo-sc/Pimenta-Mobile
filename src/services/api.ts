import axios from "axios";
const api = axios.create({
  baseURL: "https://teste-rs.herokuapp.com/",
  // baseURL: "https://malagueta.herokuapp.com/",
});
export { api };
