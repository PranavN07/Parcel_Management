package com.parcelmanagement.service;

import com.parcelmanagement.dto.TrackingResponseDto;
import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.entity.Tracking;
import com.parcelmanagement.entity.User;
import com.parcelmanagement.repository.ParcelRepository;
import com.parcelmanagement.repository.TrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrackingService {
    
    @Autowired
    private TrackingRepository trackingRepository;
    
    @Autowired
    private ParcelRepository parcelRepository;
    
    public Tracking addTrackingUpdate(Long parcelId, Parcel.ParcelStatus status, String location, String description, User updatedBy) {
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new RuntimeException("Parcel not found with id: " + parcelId));
        
        // Update parcel status
        parcel.setStatus(status);
        parcelRepository.save(parcel);
        
        // Create tracking entry
        Tracking tracking = new Tracking(parcel, status, location, description, updatedBy);
        return trackingRepository.save(tracking);
    }
    
    public List<Tracking> getTrackingHistory(String trackingNumber) {
        return trackingRepository.findByTrackingNumberOrderByTimestampDesc(trackingNumber);
    }
    
    public List<Tracking> getTrackingHistoryByParcelId(Long parcelId) {
        return trackingRepository.findByParcelIdOrderByTimestampDesc(parcelId);
    }
    
    public List<Tracking> getTrackingHistoryByParcel(Parcel parcel) {
        return trackingRepository.findByParcelOrderByTimestampDesc(parcel);
    }
    
    public TrackingResponseDto convertToDto(Tracking tracking) {
        TrackingResponseDto dto = new TrackingResponseDto();
        dto.setId(tracking.getId());
        dto.setStatus(tracking.getStatus());
        dto.setLocation(tracking.getLocation());
        dto.setDescription(tracking.getDescription());
        dto.setTimestamp(tracking.getTimestamp());
        dto.setUpdatedBy(tracking.getUpdatedBy() != null ? 
                tracking.getUpdatedBy().getFirstName() + " " + tracking.getUpdatedBy().getLastName() : 
                "System");
        return dto;
    }
    
    public List<TrackingResponseDto> convertToDtoList(List<Tracking> trackings) {
        return trackings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}