import { getAuth } from "../utils/storage";

const BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
  const auth = getAuth();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || "Request failed");
  }
  return body;
}

export const api = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  theaters: ({ city, movieId } = {}) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (movieId != null && movieId !== "") params.set("movieId", String(movieId));
    const query = params.toString();
    return request(`/api/theaters${query ? `?${query}` : ""}`);
  },
  shows: (theaterId) => request(`/api/shows/${theaterId}`),
  seats: (showId) => request(`/api/seats/${showId}`),
  book: (payload) => request("/api/book", { method: "POST", body: JSON.stringify(payload) }),
  myBookings: () => request("/api/my-bookings"),
  adminUsers: () => request("/api/admin/users"),
  adminBookings: () => request("/api/admin/bookings"),
  adminMovies: () => request("/api/admin/movies"),
  adminTheaters: () => request("/api/admin/theaters"),
  adminShows: () => request("/api/admin/shows"),
  addMovie: (payload) => request("/api/admin/movies", { method: "POST", body: JSON.stringify(payload) }),
  addTheater: (payload) => request("/api/admin/theater", { method: "POST", body: JSON.stringify(payload) }),
  addTheaterDetails: (payload) => request("/api/admin/theaters", { method: "POST", body: JSON.stringify(payload) }),
  addShow: (payload) => request("/api/admin/shows", { method: "POST", body: JSON.stringify(payload) }),
  updateTheater: (id, payload) => request(`/api/admin/theater/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateMovie: (id, payload) => request(`/api/admin/movies/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateTheaterDetails: (id, payload) => request(`/api/admin/theaters/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  updateShow: (id, payload) => request(`/api/admin/shows/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteTheater: (id) => request(`/api/admin/theater/${id}`, { method: "DELETE" }),
  deleteMovie: (id) => request(`/api/admin/movies/${id}`, { method: "DELETE" }),
  deleteTheaterDetails: (id) => request(`/api/admin/theaters/${id}`, { method: "DELETE" }),
  deleteShow: (id) => request(`/api/admin/shows/${id}`, { method: "DELETE" }),
};
