package com.project.service;

import com.project.dto.admin.CreateTheaterRequest;
import com.project.dto.admin.CreateMovieRequest;
import com.project.dto.admin.CreateShowRequest;
import com.project.dto.admin.UpdateMovieRequest;
import com.project.dto.admin.UpdateShowRequest;
import com.project.dto.admin.UpdateTheaterRequest;
import com.project.model.Booking;
import com.project.model.Movie;
import com.project.model.Seat;
import com.project.model.Show;
import com.project.model.Theater;
import com.project.model.User;
import com.project.model.enums.SeatStatus;
import com.project.repository.BookingRepository;
import com.project.repository.MovieRepository;
import com.project.repository.SeatRepository;
import com.project.repository.ShowRepository;
import com.project.repository.TheaterRepository;
import com.project.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    public AdminService(
            UserRepository userRepository,
            MovieRepository movieRepository,
            TheaterRepository theaterRepository,
            BookingRepository bookingRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.theaterRepository = theaterRepository;
        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public Theater createTheater(CreateTheaterRequest request) {
        validateTheaterRequest(request);
        Theater theater = new Theater();
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setCity(request.getCity());
        theater.setLatitude(request.getLatitude());
        theater.setLongitude(request.getLongitude());
        return theaterRepository.save(theater);
    }

    public List<Theater> getTheaters() {
        return theaterRepository.findAll();
    }

    public Theater updateTheater(Long id, CreateTheaterRequest request) {
        validateTheaterRequest(request);
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setCity(request.getCity());
        theater.setLatitude(request.getLatitude());
        theater.setLongitude(request.getLongitude());
        return theaterRepository.save(theater);
    }

    public void deleteTheater(Long id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        if (showRepository.countByTheaterId(id) > 0) {
            throw new RuntimeException("Cannot delete theater with existing shows");
        }
        theaterRepository.delete(theater);
    }

    public List<Booking> getBookings() {
        return bookingRepository.findAll();
    }

    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    public List<Show> getShows() {
        return showRepository.findAll();
    }

    public Movie createMovie(CreateMovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setLanguage(request.getLanguage());
        movie.setDuration(request.getDuration());
        movie.setRating(request.getRating());
        movie.setPosterUrl(request.getImageUrl());
        movie.setDescription(request.getDescription());
        movie.setGenre("General");
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, UpdateMovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setTitle(request.getTitle());
        movie.setLanguage(request.getLanguage());
        movie.setDuration(request.getDuration());
        movie.setRating(request.getRating());
        movie.setPosterUrl(request.getImageUrl());
        movie.setDescription(request.getDescription());
        return movieRepository.save(movie);
    }

    public Theater updateTheaterDetails(Long id, UpdateTheaterRequest request) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found"));
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setImageUrl(request.getImage());
        return theaterRepository.save(theater);
    }

    public Show updateShow(Long id, UpdateShowRequest request) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Theater theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        show.setMovie(movie);
        show.setTheater(theater);
        show.setShowTime(request.getShowTime());
        return showRepository.save(show);
    }

    public Theater createTheaterDetails(UpdateTheaterRequest request) {
        Theater theater = new Theater();
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setImageUrl(request.getImage());
        theater.setCity(deriveCity(request.getLocation()));
        theater.setLatitude(12.9716);
        theater.setLongitude(77.5946);
        return theaterRepository.save(theater);
    }

    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        if (showRepository.countByMovieId(id) > 0) {
            throw new RuntimeException("Cannot delete movie with existing shows");
        }
        movieRepository.delete(movie);
    }

    public void deleteTheaterDetails(Long id) {
        deleteTheater(id);
    }

    public Show createShow(CreateShowRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Theater theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        Show show = new Show();
        show.setMovie(movie);
        show.setTheater(theater);
        show.setShowTime(request.getShowTime());
        show.setPrice(200.0);
        show = showRepository.save(show);

        for (int i = 1; i <= 30; i++) {
            Seat seat = new Seat();
            seat.setShow(show);
            seat.setSeatNumber("A" + i);
            seat.setStatus(SeatStatus.AVAILABLE);
            seatRepository.save(seat);
        }
        return show;
    }

    public void deleteShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        if (bookingRepository.countByShowId(id) > 0) {
            throw new RuntimeException("Cannot remove show with bookings");
        }
        seatRepository.deleteByShowId(id);
        showRepository.delete(show);
    }

    private void validateTheaterRequest(CreateTheaterRequest request) {
        if (request.getLatitude() < -90 || request.getLatitude() > 90) {
            throw new RuntimeException("Latitude must be between -90 and 90");
        }
        if (request.getLongitude() < -180 || request.getLongitude() > 180) {
            throw new RuntimeException("Longitude must be between -180 and 180");
        }
    }

    private String deriveCity(String location) {
        if (location == null || location.isBlank()) {
            return "Bengaluru";
        }
        String[] parts = location.split(",");
        if (parts.length == 0) {
            return "Bengaluru";
        }
        String candidate = parts[parts.length - 1].trim();
        return candidate.isEmpty() ? "Bengaluru" : candidate;
    }
}
