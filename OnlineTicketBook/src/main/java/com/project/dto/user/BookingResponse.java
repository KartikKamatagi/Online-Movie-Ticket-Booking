package com.project.dto.user;

public class BookingResponse {
    private Long bookingId;
    private Double totalAmount;
    private String paymentStatus;
    private String seatNumbers;
    private String message;

    public BookingResponse() {
    }

    public BookingResponse(Long bookingId, Double totalAmount, String paymentStatus, String seatNumbers, String message) {
        this.bookingId = bookingId;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.seatNumbers = seatNumbers;
        this.message = message;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
