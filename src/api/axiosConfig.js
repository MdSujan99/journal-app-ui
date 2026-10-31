import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://journal-api-12q6.onrender.com/api/"
    : "http://localhost:8081/api/");

export default axios.create({
  baseURL: API_BASE_URL,
});


