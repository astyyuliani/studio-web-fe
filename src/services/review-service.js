import { api } from "./api";

export const reviewService = {
  getReview: async (id) => {
    return api.get(`/review/${id}`);
  },

  getReviews: async () => {
    return api.get("/reviews");
  },

  getSomeReviews: async () => {
    return api.get("/reviews/some");
  },

  create: async (data) => {
    return api.post("/review", data);
  },
};
