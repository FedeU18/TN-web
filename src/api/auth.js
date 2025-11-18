import axios from "../libs/axios";

export const loginRequest = async (email, password) => {
  return axios.post("/auth/login", {
    email,
    password,
  });
};

export const registerRequest = async (userData) => {
  return axios.post("/auth/registro", userData);
};

export const forgotPasswordRequest = async (email) => {
  return axios.post("/auth/forgot-password", { email });
};

// ❌ actualmente envías { token }, pero tu backend espera { email, code }
export const verifyResetTokenRequest = async (email, code) => {
  return axios.post("/auth/verify-reset-token", { email, code });
};

export const resetPasswordRequest = async (email, code, newPassword) => {
  return axios.post("/auth/reset-password", { email, code, newPassword });
};

export const profileRequest = async (token) => {
  return axios.get("/auth/profile");
};
