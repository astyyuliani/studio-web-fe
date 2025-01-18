import { api } from "./api";

export const timeService = {
  getTimes: async () => {
    return api.get("/times");
  },

  createTime: async (data) => {
    return api.post("/time", data);
  },

  deleteTime: async (id) => {
    return api.delete(`/time/${id}`);
  },
};
