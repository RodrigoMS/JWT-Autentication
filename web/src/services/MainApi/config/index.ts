import axios from "axios"

const baseAPI = axios.create({
  baseURL: "http://localhost:3000",
  //baseURL: "http://192.167.4.124:3000",
  headers: {
    "Content-Type": "application/json"
  }
})

export default baseAPI