import { api } from "./api";

export const categoryService = {
  getCategories: async () => {
    return api.get("/categories");
  },

  getLatestCategories: async () => {
    return api.get("/categories/latest");
  },

  getCategory: async (id) => {
    return api.get(`/category/${id}`);
  },

  createCategory: async (data) => {
    return api.post("/category", data);
  },

  updateCategory: async (id, data) => {
    return api.put(`/category/${id}`, data);
  },

  deleteCategory: async (id) => {
    return api.delete(`/category/${id}`);
  },
};
