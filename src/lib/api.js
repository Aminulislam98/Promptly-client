const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("server_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Prompts
export const getPrompts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/prompts?${query}`);
};

export const getFeaturedPrompts = () => apiFetch("/api/prompts/featured");

export const getPromptById = (id) => apiFetch(`/api/prompts/${id}`);

export const addPrompt = (data) =>
  apiFetch("/api/prompts", { method: "POST", body: JSON.stringify(data) });

export const updatePrompt = (id, data) =>
  apiFetch(`/api/prompts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deletePrompt = (id) =>
  apiFetch(`/api/prompts/${id}`, { method: "DELETE" });

export const incrementCopyCount = (id) =>
  apiFetch(`/api/prompts/${id}/copy`, { method: "PATCH" });

export const getMyPrompts = () => apiFetch("/api/my-prompts");

// Reviews
export const getReviews = (promptId) => apiFetch(`/api/reviews/${promptId}`);

export const addReview = (data) =>
  apiFetch("/api/reviews", { method: "POST", body: JSON.stringify(data) });

export const getMyReviews = () => apiFetch("/api/my-reviews");

export const deleteReview = (id) =>
  apiFetch(`/api/reviews/${id}`, { method: "DELETE" });

// Bookmarks
export const getBookmarks = () => apiFetch("/api/bookmarks");

export const toggleBookmark = (promptId) =>
  apiFetch("/api/bookmarks", {
    method: "POST",
    body: JSON.stringify({ promptId }),
  });

export const removeBookmark = (promptId) =>
  apiFetch(`/api/bookmarks/${promptId}`, { method: "DELETE" });

// Reports
export const reportPrompt = (data) =>
  apiFetch("/api/reports", { method: "POST", body: JSON.stringify(data) });

// Creator Requests
export const applyForCreator = (data) =>
  apiFetch("/api/creator-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getCreatorRequestStatus = () =>
  apiFetch("/api/creator-requests/status");

// Top Creators
export const getTopCreators = () => apiFetch("/api/top-creators");

// User
export const getMyProfile = () => apiFetch("/api/users/me");

// Payment
export const createCheckout = () =>
  apiFetch("/api/payment/create-checkout", { method: "POST" });

export const confirmPayment = (sessionId) =>
  apiFetch("/api/payment/success", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });

// Admin
export const getAdminUsers = () => apiFetch("/api/admin/users");

export const changeUserRole = (id, role) =>
  apiFetch(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const deleteUser = (id) =>
  apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });

export const getAdminPrompts = () => apiFetch("/api/admin/prompts");

export const approvePrompt = (id) =>
  apiFetch(`/api/admin/prompts/${id}/approve`, { method: "PATCH" });

export const rejectPrompt = (id, feedback) =>
  apiFetch(`/api/admin/prompts/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ feedback }),
  });

export const featurePrompt = (id) =>
  apiFetch(`/api/admin/prompts/${id}/feature`, { method: "PATCH" });

export const deleteAdminPrompt = (id) =>
  apiFetch(`/api/admin/prompts/${id}`, { method: "DELETE" });

export const getAdminPayments = () => apiFetch("/api/admin/payments");

export const getAdminReports = () => apiFetch("/api/admin/reports");

export const dismissReport = (id) =>
  apiFetch(`/api/admin/reports/${id}`, { method: "DELETE" });

export const warnCreator = (id) =>
  apiFetch(`/api/admin/reports/${id}/warn`, { method: "POST" });

export const getCreatorRequests = () => apiFetch("/api/admin/creator-requests");

export const approveCreatorRequest = (id) =>
  apiFetch(`/api/admin/creator-requests/${id}/approve`, { method: "PATCH" });

export const rejectCreatorRequest = (id) =>
  apiFetch(`/api/admin/creator-requests/${id}/reject`, { method: "PATCH" });

export const getAdminAnalytics = () => apiFetch("/api/admin/analytics");
