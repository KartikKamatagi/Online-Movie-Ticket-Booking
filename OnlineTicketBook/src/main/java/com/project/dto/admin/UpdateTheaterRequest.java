package com.project.dto.admin;

import jakarta.validation.constraints.NotBlank;

public class UpdateTheaterRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String location;
    @NotBlank
    private String image;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
