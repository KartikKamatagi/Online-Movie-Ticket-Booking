package com.project.controller;

import com.project.dto.user.BookingRequest;
import com.project.dto.user.BookingResponse;
import com.project.model.Booking;
import com.project.model.Movie;
import com.project.model.Seat;
import com.project.model.Show;
import com.project.model.Theater;
import com.project.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final BookingService bookingService;

    public UserController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/theaters")
    public ResponseEntity<List<Theater>> getTheaters(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long movieId) {
        return ResponseEntity.ok(bookingService.getTheaters(city, movieId));
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getMovies() {
        return ResponseEntity.ok(bookingService.getMovies());
    }

    @GetMapping("/shows/{theaterId}")
    public ResponseEntity<List<Show>> getShows(@PathVariable Long theaterId) {
        return ResponseEntity.ok(bookingService.getShowsByTheater(theaterId));
    }

    @GetMapping("/seats/{showId}")
    public ResponseEntity<List<Seat>> getSeats(@PathVariable Long showId) {
        return ResponseEntity.ok(bookingService.getSeatsByShow(showId));
    }

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> book(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        return ResponseEntity.ok(bookingService.createBooking(request, authentication));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> myBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.myBookings(authentication));
    }
}
