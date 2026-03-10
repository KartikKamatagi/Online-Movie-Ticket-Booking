package com.project.dto.admin;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class UpdateShowRequest {
    @NotNull
    private Long movieId;
    @NotNull
    private Long theaterId;
    @NotNull
    private LocalDateTime showTime;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getTheaterId() {
        return theaterId;
    }

    public void setTheaterId(Long theaterId) {
        this.theaterId = theaterId;
    }

    public LocalDateTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalDateTime showTime) {
        this.showTime = showTime;
    }
}
