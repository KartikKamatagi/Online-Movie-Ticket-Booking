import { useEffect, useState } from "react";
import { api } from "../services/api";
import UserNavbar from "../components/UserNavbar";
import { saveLastBooking } from "../utils/storage";
import "./MyBookings.css";

function MyBookings({ navigate, logout, auth }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    api
      .myBookings()
      .then((items) => setBookings(Array.isArray(items) ? items : []))
      .catch((err) => setError(err.message || "Unable to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();

  const filteredBookings = bookings.filter((booking) => {
    const time = booking?.show?.showTime ? new Date(booking.show.showTime).getTime() : 0;
    if (filter === "upcoming") return time >= now;
    if (filter === "past") return time < now;
    return true;
  });

  const toStatusClass = (status = "") => {
    const value = status.toUpperCase();
    if (value.includes("SUCCESS")) return "success";
    if (value.includes("PENDING")) return "pending";
    return "cancelled";
  };

  const handleViewTicket = (booking) => {
    saveLastBooking({
      bookingId: booking?.id,
      totalAmount: booking?.totalAmount,
      paymentStatus: booking?.paymentStatus,
      seatNumbers: booking?.seatNumbers,
    });
    navigate("/success");
  };

  return (
    <div className="my-bookings-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
      <div className="page my-bookings-layout">
        <div className="card wide my-bookings-shell dashboard-shell">
          <section className="bookings-main">
            <div className="row my-bookings-header">
              <div>
                <p className="bookings-kicker">Booking Dashboard</p>
                <h2>My Bookings</h2>
                <p className="bookings-count">You have {filteredBookings.length} bookings</p>
              </div>
              <div className="bookings-filter-wrap">
                <label htmlFor="bookings-filter">Filter</label>
                <select id="bookings-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>

            {loading && <p className="my-bookings-empty">Loading bookings...</p>}
            {!loading && error && <p className="my-bookings-empty">{error}</p>}
            {!loading && !error && filteredBookings.length === 0 && (
              <p className="my-bookings-empty">No bookings yet. Start booking your favorite movies!</p>
            )}

            <div className="grid my-bookings-grid">
              {filteredBookings.map((booking) => {
                const statusClass = toStatusClass(booking?.paymentStatus);
                return (
                  <article className="tile my-bookings-card ticket-card" key={booking.id}>
                    <div className="ticket-left">
                      <img
                        src={booking?.show?.movie?.posterUrl || booking?.show?.movie?.imageUrl || "https://via.placeholder.com/240x360?text=Movie"}
                        alt={booking?.show?.movie?.title || "Movie"}
                        className="ticket-poster"
                      />
                    </div>

                    <div className="ticket-middle">
                      <h3>{booking?.show?.movie?.title || "Movie"}</h3>
                      <p>{booking?.show?.theater?.name || "Theater"}</p>
                      <p>{booking?.show?.showTime ? new Date(booking.show.showTime).toLocaleString() : "N/A"}</p>
                      <p>Seats: {booking?.seatNumbers || "N/A"}</p>
                    </div>

                    <div className="ticket-right">
                      <p className="ticket-amount">Rs {Number(booking?.totalAmount || 0).toFixed(2)}</p>
                      <span className={`status-badge ${statusClass}`}>{booking?.paymentStatus || "CANCELLED"}</span>
                      <button type="button" className="view-ticket-btn" onClick={() => handleViewTicket(booking)}>
                        View Ticket
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
