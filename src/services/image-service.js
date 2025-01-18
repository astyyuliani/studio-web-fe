import { api } from "./api";

export const imageService = {
  upload: async (formData) => {
    return api.post("/upload", formData);
  },
};
