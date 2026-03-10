package com.project.repository;

import com.project.model.Seat;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByShowIdOrderBySeatNumberAsc(Long showId);
    List<Seat> findByShowIdAndIdIn(Long showId, List<Long> ids);
    void deleteByShowId(Long showId);
}
