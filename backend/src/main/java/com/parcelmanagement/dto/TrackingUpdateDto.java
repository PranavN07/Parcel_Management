package com.parcelmanagement.dto;

import com.parcelmanagement.entity.Parcel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TrackingUpdateDto {
    
    @NotNull(message = "Status is required")
    private Parcel.ParcelStatus status;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String description;
    
    // Constructors
    public TrackingUpdateDto() {}
    
    public TrackingUpdateDto(Parcel.ParcelStatus status, String location, String description) {
        this.status = status;
        this.location = location;
        this.description = description;
    }
    
    // Getters and Setters
    public Parcel.ParcelStatus getStatus() { return status; }
    public void setStatus(Parcel.ParcelStatus status) { this.status = status; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}