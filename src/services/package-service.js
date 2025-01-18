import { api } from "./api";

export const packageService = {
  getPackages: async () => {
    return api.get("/packages");
  },

  getPackage: async (id) => {
    return api.get(`/package/${id}`);
  },

  createPackage: async (data) => {
    return api.post("/package", data);
  },

  updatePackage: async (id, data) => {
    return api.put(`/package/${id}`, data);
  },

  deletePackage: async (id) => {
    return api.delete(`/package/${id}`);
  },
};
