import { api } from "./api";

export const reservationService = {
  getReservations: async () => {
    return api.get("/reservations");
  },

  getReservation: async (id) => {
    return api.get(`/reservation/${id}`);
  },

  getUserReservation: async () => {
    return api.get("/reservations/user");
  },

  getReservationByDate: async (date) => {
    return api.get(`/reservation/date?date=${date}`);
  },

  createReservation: async (data) => {
    return api.post("/reservation", data);
  },

  setSuccess: async (id) => {
    return api.patch(`/reservation/${id}/success`);
  },

  setCancel: async (id) => {
    return api.patch(`/reservation/${id}/cancel`);
  },
};
