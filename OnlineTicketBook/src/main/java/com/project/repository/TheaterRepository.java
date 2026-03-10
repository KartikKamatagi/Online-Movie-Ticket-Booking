package com.project.repository;

import com.project.model.Theater;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TheaterRepository extends JpaRepository<Theater, Long> {
    List<Theater> findByCityIgnoreCase(String city);

    @Query("SELECT DISTINCT s.theater FROM Show s WHERE s.movie.id = :movieId")
    List<Theater> findDistinctByMovieId(@Param("movieId") Long movieId);

    @Query("SELECT DISTINCT s.theater FROM Show s WHERE s.movie.id = :movieId AND LOWER(s.theater.city) = LOWER(:city)")
    List<Theater> findDistinctByMovieIdAndCityIgnoreCase(@Param("movieId") Long movieId, @Param("city") String city);
}
