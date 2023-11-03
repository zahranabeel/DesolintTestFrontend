import axios from "axios";

const instance = axios.create({
  baseURL : 'desolint-test-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json',
},
});

export default instance;