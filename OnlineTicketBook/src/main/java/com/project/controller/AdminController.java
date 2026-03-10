package com.project.controller;

import com.project.dto.admin.CreateTheaterRequest;
import com.project.dto.admin.CreateMovieRequest;
import com.project.dto.admin.CreateShowRequest;
import com.project.dto.admin.UpdateMovieRequest;
import com.project.dto.admin.UpdateShowRequest;
import com.project.dto.admin.UpdateTheaterRequest;
import com.project.model.Booking;
import com.project.model.Movie;
import com.project.model.Show;
import com.project.model.Theater;
import com.project.model.User;
import com.project.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> users() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PostMapping("/theater")
    public ResponseEntity<Theater> addTheater(@Valid @RequestBody CreateTheaterRequest request) {
        return ResponseEntity.ok(adminService.createTheater(request));
    }

    @GetMapping("/theaters")
    public ResponseEntity<List<Theater>> theaters() {
        return ResponseEntity.ok(adminService.getTheaters());
    }

    @PutMapping("/theater/{id}")
    public ResponseEntity<Theater> updateTheater(@PathVariable Long id, @Valid @RequestBody CreateTheaterRequest request) {
        return ResponseEntity.ok(adminService.updateTheater(id, request));
    }

    @DeleteMapping("/theater/{id}")
    public ResponseEntity<Void> deleteTheater(@PathVariable Long id) {
        adminService.deleteTheater(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> movies() {
        return ResponseEntity.ok(adminService.getMovies());
    }

    @PostMapping("/movies")
    public ResponseEntity<Movie> createMovie(@Valid @RequestBody CreateMovieRequest request) {
        return ResponseEntity.ok(adminService.createMovie(request));
    }

    @GetMapping("/shows")
    public ResponseEntity<List<Show>> shows() {
        return ResponseEntity.ok(adminService.getShows());
    }

    @PostMapping("/theaters")
    public ResponseEntity<Theater> createTheaterDetails(@Valid @RequestBody UpdateTheaterRequest request) {
        return ResponseEntity.ok(adminService.createTheaterDetails(request));
    }

    @PostMapping("/shows")
    public ResponseEntity<Show> createShow(@Valid @RequestBody CreateShowRequest request) {
        return ResponseEntity.ok(adminService.createShow(request));
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @Valid @RequestBody UpdateMovieRequest request) {
        return ResponseEntity.ok(adminService.updateMovie(id, request));
    }

    @PutMapping("/theaters/{id}")
    public ResponseEntity<Theater> updateTheaterDetails(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTheaterRequest request) {
        return ResponseEntity.ok(adminService.updateTheaterDetails(id, request));
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<Show> updateShow(@PathVariable Long id, @Valid @RequestBody UpdateShowRequest request) {
        return ResponseEntity.ok(adminService.updateShow(id, request));
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        adminService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/theaters/{id}")
    public ResponseEntity<Void> deleteTheaterDetails(@PathVariable Long id) {
        adminService.deleteTheaterDetails(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/shows/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        adminService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> bookings() {
        return ResponseEntity.ok(adminService.getBookings());
    }
}
