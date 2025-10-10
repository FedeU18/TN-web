import axios from "../libs/axios";

export const loginRequest = async (email, password) => {
  return axios.post("/auth/login", {
    email,
    password,
  });
};

export const registerRequest = async (userData) => {
  return axios.post("/auth/registro", userData);
}

export const forgotPasswordRequest = async (email) => {
  return axios.post("/auth/forgot-password", { email });
}

export const verifyResetTokenRequest = async (token) => {
  return axios.post("/auth/verify-reset-token", { token });
};

export const resetPasswordRequest = async ({ token, newPassword }) => {
  return axios.post("/auth/reset-password", { token, newPassword });
};

export const profileRequest = async (token) => {
  return axios.get("/auth/profile")
}