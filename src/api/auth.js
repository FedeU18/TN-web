import axios from "../libs/axios";

export const loginRequest = async (email, password) => {
  return axios.post("/login", {
    email,
    password,
  });
};

export const registerRequest = async (userData) => {
  return axios.post("/registro", userData);
}

export const forgotPasswordRequest = async (email) => {
  return axios.post("/forgot-password", { email });
}

export const verifyResetTokenRequest = async (token) => {
  return axios.post("/verify-reset-token", { token });
};

export const resetPasswordRequest = async ({ token, newPassword }) => {
  return axios.post("/reset-password", { token, newPassword });
};

export const profileRequest = async (token) => {
  return axios.get("/profile")
}