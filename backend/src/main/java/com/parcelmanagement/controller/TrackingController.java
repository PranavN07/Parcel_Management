package com.parcelmanagement.controller;

import com.parcelmanagement.dto.TrackingResponseDto;
import com.parcelmanagement.dto.TrackingUpdateDto;
import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.entity.Tracking;
import com.parcelmanagement.entity.User;
import com.parcelmanagement.service.ParcelService;
import com.parcelmanagement.service.TrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Tracking", description = "Parcel tracking APIs")
public class TrackingController {
    
    @Autowired
    private TrackingService trackingService;
    
    @Autowired
    private ParcelService parcelService;
    
    @GetMapping("/public/{trackingNumber}")
    @Operation(summary = "Track parcel by tracking number", description = "Get tracking history for a parcel by tracking number (public)")
    public ResponseEntity<?> trackParcel(@PathVariable String trackingNumber) {
        Optional<Parcel> parcelOpt = parcelService.findByTrackingNumber(trackingNumber);
        
        if (parcelOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Parcel not found with tracking number: " + trackingNumber);
            return ResponseEntity.notFound().build();
        }
        
        List<Tracking> trackings = trackingService.getTrackingHistory(trackingNumber);
        List<TrackingResponseDto> response = trackingService.convertToDtoList(trackings);
        
        Map<String, Object> result = new HashMap<>();
        result.put("parcel", parcelService.convertToDto(parcelOpt.get()));
        result.put("trackingHistory", response);
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/parcel/{parcelId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get tracking history by parcel ID", description = "Get tracking history for a parcel by ID")
    public ResponseEntity<?> getTrackingByParcelId(@PathVariable Long parcelId, Authentication authentication) {
        Optional<Parcel> parcelOpt = parcelService.findById(parcelId);
        
        if (parcelOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Parcel not found");
            return ResponseEntity.notFound().build();
        }
        
        Parcel parcel = parcelOpt.get();
        User currentUser = (User) authentication.getPrincipal();
        
        // Check if user has permission to view this parcel's tracking
        if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
            !currentUser.getRole().equals(User.UserRole.STAFF) &&
            !parcel.getSender().getId().equals(currentUser.getId()) &&
            !parcel.getReceiver().getId().equals(currentUser.getId())) {
            return ResponseEntity.forbidden().build();
        }
        
        List<Tracking> trackings = trackingService.getTrackingHistoryByParcelId(parcelId);
        List<TrackingResponseDto> response = trackingService.convertToDtoList(trackings);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/parcel/{parcelId}/update")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add tracking update", description = "Add a new tracking update for a parcel (Admin/Staff only)")
    public ResponseEntity<?> addTrackingUpdate(@PathVariable Long parcelId,
                                              @Valid @RequestBody TrackingUpdateDto updateDto,
                                              Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            
            Tracking tracking = trackingService.addTrackingUpdate(
                    parcelId,
                    updateDto.getStatus(),
                    updateDto.getLocation(),
                    updateDto.getDescription(),
                    currentUser
            );
            
            TrackingResponseDto response = trackingService.convertToDto(tracking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user/parcels")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user's parcel tracking", description = "Get tracking for all user's parcels")
    public ResponseEntity<Map<String, Object>> getUserParcelTracking(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Parcel> userParcels = parcelService.findByUserId(currentUser.getId());
        
        Map<String, Object> result = new HashMap<>();
        
        for (Parcel parcel : userParcels) {
            List<Tracking> trackings = trackingService.getTrackingHistoryByParcel(parcel);
            List<TrackingResponseDto> trackingDtos = trackingService.convertToDtoList(trackings);
            result.put(parcel.getTrackingNumber(), trackingDtos);
        }
        
        return ResponseEntity.ok(result);
    }
}