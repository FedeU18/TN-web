import axios from "axios";

export const loginRequest = async (email, password) => {
  return axios.post("http://localhost:3000/api/auth/login", {
    email,
    password,
  });
};

export const registerRequest = async (userData) => {
  return axios.post("http://localhost:3000/api/auth/registro", userData);
}