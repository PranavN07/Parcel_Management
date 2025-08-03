package com.parcelmanagement.dto;

import com.parcelmanagement.entity.Parcel;

import java.time.LocalDateTime;

public class TrackingResponseDto {
    
    private Long id;
    private Parcel.ParcelStatus status;
    private String location;
    private String description;
    private LocalDateTime timestamp;
    private String updatedBy;
    
    // Constructors
    public TrackingResponseDto() {}
    
    public TrackingResponseDto(Long id, Parcel.ParcelStatus status, String location, String description, LocalDateTime timestamp, String updatedBy) {
        this.id = id;
        this.status = status;
        this.location = location;
        this.description = description;
        this.timestamp = timestamp;
        this.updatedBy = updatedBy;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Parcel.ParcelStatus getStatus() { return status; }
    public void setStatus(Parcel.ParcelStatus status) { this.status = status; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}