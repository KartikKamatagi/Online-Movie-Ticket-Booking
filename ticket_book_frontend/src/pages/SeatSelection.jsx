import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { savePendingBooking } from "../utils/storage";
import UserNavbar from "../components/UserNavbar";
import "./BookingFlow.css";

function SeatSelection({ route, navigate, logout, auth }) {
  const showId = route.query.get("showId");
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showId) {
      api.seats(showId).then(setSeats);
    }
  }, [showId]);

  const total = useMemo(() => selected.length * 200, [selected.length]);

  const toggle = (seat) => {
    if (seat.status === "BOOKED") return;
    setSelected((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  const proceed = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      savePendingBooking({
        showId: Number(showId),
        seatIds: selected,
        totalAmount: total,
      });
      navigate("/payment");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seat-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
      <div className="page seat-layout">
        <div className="card wide booking-shell seat-shell">
          <section className="seat-main">
            <div className="row seat-header">
              <div>
                <p className="seat-kicker">Seat Dashboard</p>
                <h2>Select Seats</h2>
                <p className="flow-kicker">Pick your seats and continue to payment</p>
              </div>
              <button className="seat-back-btn" onClick={() => window.history.back()}>Back</button>
            </div>

            <div className="screen">SCREEN</div>
            <div className="seats seat-grid">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${seat.status === "BOOKED" ? "booked" : ""} ${selected.includes(seat.id) ? "selected" : ""}`}
                  onClick={() => toggle(seat)}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>

            <div className="seat-legend">
              <span><i className="legend available" />Available</span>
              <span><i className="legend selected" />Selected</span>
              <span><i className="legend booked" />Booked</span>
            </div>
          </section>

          <aside className="seat-summary">
            <h3>Booking Summary</h3>
            <p className="seat-summary-row">
              <span>Seat Price</span>
              <strong>Rs 200</strong>
            </p>
            <p className="seat-summary-row">
              <span>Selected Seats</span>
              <strong>{selected.length}</strong>
            </p>
            <p className="seat-summary-total">
              <span>Total Amount</span>
              <strong>Rs {total}</strong>
            </p>
            {error && <p className="flow-info">{error}</p>}
            <button className="seat-proceed-btn" disabled={!selected.length || isSubmitting} onClick={proceed}>
              {isSubmitting ? "Please wait..." : "Proceed to Payment"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
