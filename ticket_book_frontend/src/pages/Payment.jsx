import { useState } from "react";
import { api } from "../services/api";
import { clearPendingBooking, getPendingBooking, saveLastBooking } from "../utils/storage";
import UserNavbar from "../components/UserNavbar";
import "./BookingFlow.css";

function Payment({ navigate, logout, auth }) {
  const booking = getPendingBooking();
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState("RAZORPAY");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!booking) {
    return (
      <div className="payment-page">
        <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
        <div className="page payment-layout">
          <div className="card payment-shell payment-empty-shell">
            <h2>No pending booking</h2>
            <button onClick={() => navigate("/theaters")}>Book ticket</button>
          </div>
        </div>
      </div>
    );
  }

  const payNow = async () => {
    setError("");
    setIsPaying(true);
    if (method === "UPI" && !upiId.trim()) {
      setError("Enter UPI ID");
      setIsPaying(false);
      return;
    }
    if (method === "CARD" && (!cardNumber.trim() || !holderName.trim() || !expiry.trim() || !cvv.trim())) {
      setError("Enter complete card details");
      setIsPaying(false);
      return;
    }
    try {
      const result = await api.book({
        showId: booking.showId,
        seatIds: booking.seatIds,
      });
      clearPendingBooking();
      saveLastBooking(result);
      navigate("/success");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
      <div className="page payment-layout">
        <div className="card booking-shell payment-shell">
          <h2>Secure Payment</h2>
          <p className="flow-kicker">Complete payment to confirm your seats</p>
          <p className="flow-price">Total: Rs {booking.totalAmount}</p>

          <div className="payment-methods">
            <label className={`pay-option ${method === "RAZORPAY" ? "active" : ""}`}>
              <input type="radio" checked={method === "RAZORPAY"} onChange={() => setMethod("RAZORPAY")} />
              <span>Razorpay (UPI / Card / NetBanking / Wallets)</span>
            </label>
            <label className={`pay-option ${method === "UPI" ? "active" : ""}`}>
              <input type="radio" checked={method === "UPI"} onChange={() => setMethod("UPI")} />
              <span>Direct UPI</span>
            </label>
            <label className={`pay-option ${method === "CARD" ? "active" : ""}`}>
              <input type="radio" checked={method === "CARD"} onChange={() => setMethod("CARD")} />
              <span>Credit / Debit Card</span>
            </label>
            <label className={`pay-option ${method === "NETBANKING" ? "active" : ""}`}>
              <input type="radio" checked={method === "NETBANKING"} onChange={() => setMethod("NETBANKING")} />
              <span>Net Banking</span>
            </label>
          </div>

          {method === "UPI" && (
            <input
              placeholder="UPI ID (example@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          )}

          {method === "CARD" && (
            <div className="payment-grid">
              <input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <input
                placeholder="Card Holder Name"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
              />
              <input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <input
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          )}

          <button onClick={payNow} disabled={isPaying}>
            {isPaying ? "Processing..." : "Pay & Confirm"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Payment;
