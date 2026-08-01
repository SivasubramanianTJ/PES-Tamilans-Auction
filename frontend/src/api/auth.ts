import api from "./axios";

export function login(username: string, password: string) {
  return api.post("/auth/login", {
    username,
    password,
  });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

import axios from "./axios";

export function createUser(data: {
  fullName: string;
  username: string;
  password: string;
  role: "ADMIN" | "CAPTAIN";
}) {
  return axios.post("/auth/create-user", data);
}