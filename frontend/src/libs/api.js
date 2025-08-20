// api.js
import axios from "axios";


const base_url=import.meta.env.VITE_BACKEND_BASE_URL
export default axios.create({
  baseURL: base_url, // change this
});
