import { getLastBooking } from "../utils/storage";
import UserNavbar from "../components/UserNavbar";
import "./BookingSuccess.css";

function BookingSuccess({ navigate, logout, auth }) {
  const last = getLastBooking();
  const confirmedAt = new Date().toLocaleString();
  const formattedAmount = last?.totalAmount != null ? `Rs ${Number(last.totalAmount).toFixed(2)}` : "N/A";

  return (
    <div>
      <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
      <div className="page success-page">
        <div className="card success-card">
          {!last && (
            <>
              <h2>No recent booking found</h2>
              <p className="success-note">Start a new booking to see confirmation details here.</p>
              <button onClick={() => navigate("/movies")}>Browse Movies</button>
            </>
          )}

          {!!last && (
            <>
              <div className="success-badge">Payment Successful</div>
              <h2>Booking Confirmed</h2>
              <p className="success-note">Your tickets are confirmed and ready. A confirmation reference is shown below.</p>

              <div className="success-grid">
                <div className="success-item">
                  <span>Booking Reference</span>
                  <strong>#{last.bookingId}</strong>
                </div>
                <div className="success-item">
                  <span>Amount Paid</span>
                  <strong>{formattedAmount}</strong>
                </div>
                <div className="success-item">
                  <span>Payment Status</span>
                  <strong>{last.paymentStatus || "SUCCESS"}</strong>
                </div>
                <div className="success-item">
                  <span>Seats</span>
                  <strong>{last.seatNumbers || "N/A"}</strong>
                </div>
                <div className="success-item">
                  <span>Confirmed On</span>
                  <strong>{confirmedAt}</strong>
                </div>
              </div>

              <div className="success-actions">
                <button onClick={() => navigate("/my-bookings")}>View My Bookings</button>
                <button className="secondary" onClick={() => navigate("/movies")}>Book Another Movie</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
