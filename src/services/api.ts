import axios from "axios";
const api = axios.create({
  baseURL: "https://malagueta.herokuapp.com",
});
export { api };
