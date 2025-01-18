import { api } from "./api";

export const transactionService = {
  getTransaction: async (id) => {
    return api.get(`/transaction/${id}`);
  },

  getTransactions: async () => {
    return api.get("/transactions");
  },

  create: async (data) => {
    return api.post("/transaction", data);
  },

  pay: async (id, data) => {
    return api.post(`/transaction/${id}/pay`, data);
  },

  setValid: async (id, detailId) => {
    return api.put(`/transaction/${id}/valid/${detailId}`);
  },

  setInValid: async (id, detailId) => {
    return api.put(`/transaction/${id}/invalid/${detailId}`);
  },

  setPaid: async (id) => {
    return api.put(`/transaction/${id}/paid`);
  },
};
