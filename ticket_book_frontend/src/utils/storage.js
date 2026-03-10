const AUTH_KEY = "movie_auth";
const PENDING_BOOKING_KEY = "pending_booking";
const LAST_BOOKING_KEY = "last_booking";

export function saveAuth(data) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function savePendingBooking(data) {
  localStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(data));
}

export function getPendingBooking() {
  const raw = localStorage.getItem(PENDING_BOOKING_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearPendingBooking() {
  localStorage.removeItem(PENDING_BOOKING_KEY);
}

export function saveLastBooking(data) {
  localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(data));
}

export function getLastBooking() {
  const raw = localStorage.getItem(LAST_BOOKING_KEY);
  return raw ? JSON.parse(raw) : null;
}
