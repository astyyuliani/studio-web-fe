import { api } from "./api";

export const addonsService = {
  getAddons: async () => {
    return api.get("/addons");
  },

  getAddon: async (id) => {
    return api.get(`/addon/${id}`);
  },

  getAddonByCategory: async (id) => {
    return api.get(`/addons/category/${id}`);
  },

  createAddon: async (data) => {
    return api.post("/addon", data);
  },

  updateAddon: async (id, data) => {
    return api.put(`/addon/${id}`, data);
  },

  deleteAddon: async (id) => {
    return api.delete(`/addon/${id}`);
  },
};
