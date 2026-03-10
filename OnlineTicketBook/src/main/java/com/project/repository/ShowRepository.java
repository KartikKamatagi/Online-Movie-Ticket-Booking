package com.project.repository;

import com.project.model.Show;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByTheaterIdOrderByShowTimeAsc(Long theaterId);
    long countByTheaterId(Long theaterId);
    long countByMovieId(Long movieId);
}
