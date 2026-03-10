package com.project.service;

import com.project.dto.user.BookingRequest;
import com.project.dto.user.BookingResponse;
import com.project.model.Booking;
import com.project.model.Movie;
import com.project.model.Seat;
import com.project.model.Show;
import com.project.model.Theater;
import com.project.model.User;
import com.project.model.enums.PaymentStatus;
import com.project.model.enums.SeatStatus;
import com.project.repository.BookingRepository;
import com.project.repository.MovieRepository;
import com.project.repository.SeatRepository;
import com.project.repository.ShowRepository;
import com.project.repository.TheaterRepository;
import com.project.repository.UserRepository;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final TheaterRepository theaterRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(
            TheaterRepository theaterRepository,
            MovieRepository movieRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository) {
        this.theaterRepository = theaterRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public List<Theater> getTheaters(String city, Long movieId) {
        if (movieId != null && city != null && !city.isBlank()) {
            return theaterRepository.findDistinctByMovieIdAndCityIgnoreCase(movieId, city);
        }
        if (movieId != null) {
            return theaterRepository.findDistinctByMovieId(movieId);
        }
        if (city != null && !city.isBlank()) {
            return theaterRepository.findByCityIgnoreCase(city);
        }
        return theaterRepository.findAll();
    }

    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    public List<Show> getShowsByTheater(Long theaterId) {
        return showRepository.findByTheaterIdOrderByShowTimeAsc(theaterId);
    }

    public List<Seat> getSeatsByShow(Long showId) {
        return seatRepository.findByShowIdOrderBySeatNumberAsc(showId);
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        List<Seat> selectedSeats = seatRepository.findByShowIdAndIdIn(request.getShowId(), request.getSeatIds());
        if (selectedSeats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Invalid seats selected");
        }

        boolean anyBooked = selectedSeats.stream().anyMatch(seat -> seat.getStatus() == SeatStatus.BOOKED);
        if (anyBooked) {
            throw new RuntimeException("One or more seats already booked");
        }

        selectedSeats.forEach(seat -> seat.setStatus(SeatStatus.BOOKED));
        seatRepository.saveAll(selectedSeats);

        double totalAmount = show.getPrice() * selectedSeats.size();
        String seatNumbers = selectedSeats.stream()
                .sorted(Comparator.comparingInt((Seat seat) -> seatNumberSortKey(seat.getSeatNumber()))
                        .thenComparing(Seat::getSeatNumber))
                .map(Seat::getSeatNumber)
                .collect(Collectors.joining(", "));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setTotalAmount(totalAmount);
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        booking.setSeatNumbers(seatNumbers);
        booking = bookingRepository.save(booking);

        return new BookingResponse(booking.getId(), totalAmount, booking.getPaymentStatus().name(), seatNumbers, "Booking successful");
    }

    public List<Booking> myBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserIdOrderByBookingTimeDesc(user.getId());
    }

    private int seatNumberSortKey(String seatNumber) {
        if (seatNumber == null) {
            return Integer.MAX_VALUE;
        }
        String digits = seatNumber.replaceAll("\\D+", "");
        if (digits.isEmpty()) {
            return Integer.MAX_VALUE;
        }
        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException ex) {
            return Integer.MAX_VALUE;
        }
    }
}
