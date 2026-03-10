package com.project.config;

import com.project.model.Movie;
import com.project.model.Seat;
import com.project.model.Show;
import com.project.model.Theater;
import com.project.model.User;
import com.project.model.enums.Role;
import com.project.model.enums.SeatStatus;
import com.project.repository.MovieRepository;
import com.project.repository.SeatRepository;
import com.project.repository.ShowRepository;
import com.project.repository.TheaterRepository;
import com.project.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            TheaterRepository theaterRepository,
            MovieRepository movieRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@movie.com")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@movie.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (theaterRepository.count() > 0 || movieRepository.count() > 0 || showRepository.count() > 0) {
                return;
            }

            Theater t1 = new Theater();
            t1.setName("PVR Orion Mall");
            t1.setLocation("Rajajinagar");
            t1.setCity("Bengaluru");
            t1.setLatitude(12.9916);
            t1.setLongitude(77.5546);

            Theater t2 = new Theater();
            t2.setName("INOX Garuda");
            t2.setLocation("Magrath Road");
            t2.setCity("Bengaluru");
            t2.setLatitude(12.9716);
            t2.setLongitude(77.6093);

            theaterRepository.saveAll(List.of(t1, t2));

            Movie movie = new Movie();
            movie.setTitle("Kantara");
            movie.setDuration(148);
            movie.setLanguage("Kannada");
            movie.setGenre("Action/Drama");
            movie.setPosterUrl("https://example.com/poster/kantara.jpg");
            movie.setDescription("An action drama set in coastal Karnataka.");
            movie = movieRepository.save(movie);

            LocalDate today = LocalDate.now();
            List<LocalDateTime> showTimes = List.of(
                    today.atTime(10, 0),
                    today.atTime(14, 0),
                    today.atTime(16, 0));

            for (Theater theater : List.of(t1, t2)) {
                for (LocalDateTime showTime : showTimes) {
                    Show show = new Show();
                    show.setMovie(movie);
                    show.setTheater(theater);
                    show.setShowTime(showTime);
                    show.setPrice(200.0);
                    show = showRepository.save(show);

                    for (int i = 1; i <= 30; i++) {
                        Seat seat = new Seat();
                        seat.setShow(show);
                        seat.setSeatNumber("A" + i);
                        seat.setStatus(SeatStatus.AVAILABLE);
                        seatRepository.save(seat);
                    }
                }
            }
        };
    }
}
