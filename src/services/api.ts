import axios from "axios";
const api = axios.create({
  baseURL: "https://teste-rs.herokuapp.com",
  // baseURL: "http://localhost:3333/",
});
export { api };
