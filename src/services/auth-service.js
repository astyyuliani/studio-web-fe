import { api } from "./api";

export const authService = {
  login: async (data) => {
    return api.post("/login", data);
  },

  register: async (data) => {
    return api.post("/register", data);
  },

  getUser: async () => {
    return api.get("/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
