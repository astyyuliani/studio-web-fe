const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/v1";

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response) => {
  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.message || "An error occurred");
  }
  return res;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return handleResponse(response);
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return handleResponse(response);
  },
};
