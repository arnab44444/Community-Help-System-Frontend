const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Remove Content-Type header if body is FormData
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || "Request failed" };
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token
      if (response.status === 401) {
        localStorage.removeItem("token");
        // Only redirect if not already on login/register page and not an auth endpoint
        const isAuthEndpoint = endpoint.includes("/auth/login") || endpoint.includes("/auth/register");
        const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register";

        if (!isAuthEndpoint && !isAuthPage) {
          // Use setTimeout to avoid redirect during render
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check if the server is running.");
    }
    throw error;
  }
};

export const authAPI = {
  register: (userData) => apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  }),
  login: (email, password) => apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }),
  getUser: (id) => apiRequest(`/users/${id}`),
  getMe: () => apiRequest("/auth/me"),
  updateProfile: (userData) => apiRequest("/auth/update", {
    method: "PUT",
    body: JSON.stringify(userData),
  }),
};

export const adminAPI = {
  getAllNgos: () => apiRequest("/admin/all-ngos"),
  approveNgo: (id) => apiRequest(`/admin/approve-ngo/${id}`, { method: "POST" }),
  rejectNgo: (id) => apiRequest(`/admin/reject-ngo/${id}`, { method: "POST" }),
  getEmergencies: () => apiRequest("/admin/emergencies"),
  getAllUsers: () => apiRequest("/admin/users"),
};

export const helpRequestAPI = {
  getAll: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/help-requests?${params}`);
  },
  getNearby: (lat, lng, radius) => {
    const params = new URLSearchParams({ lat, lng, radius }).toString();
    return apiRequest(`/help-requests/nearby?${params}`);
  },
  getNgoEmergencies: () => apiRequest("/help-requests/ngo/emergencies"),
  create: (data) => apiRequest("/help-requests", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  offerHelp: (id) => apiRequest(`/help-requests/${id}/offer`, {
    method: "POST",
  }),
  complete: (id) => apiRequest(`/help-requests/${id}/complete`, {
    method: "POST",
  }),
  getTransactions: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiRequest(`/help-requests/transactions?${params}`);
  },
};
