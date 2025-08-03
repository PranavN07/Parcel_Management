package com.parcelmanagement.controller;

import com.parcelmanagement.dto.ParcelBookingDto;
import com.parcelmanagement.dto.ParcelResponseDto;
import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.entity.User;
import com.parcelmanagement.service.ParcelService;
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
@RequestMapping("/api/parcels")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Parcel Management", description = "Parcel booking and management APIs")
@SecurityRequirement(name = "bearerAuth")
public class ParcelController {
    
    @Autowired
    private ParcelService parcelService;
    
    @PostMapping("/book")
    @Operation(summary = "Book a new parcel", description = "Create a new parcel booking")
    public ResponseEntity<?> bookParcel(@Valid @RequestBody ParcelBookingDto bookingDto, 
                                       Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Parcel parcel = parcelService.bookParcel(bookingDto, currentUser.getId());
            
            ParcelResponseDto response = parcelService.convertToDto(parcel);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/my-parcels")
    @Operation(summary = "Get user's parcels", description = "Get all parcels for the authenticated user")
    public ResponseEntity<List<ParcelResponseDto>> getUserParcels(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Parcel> parcels = parcelService.findByUserId(currentUser.getId());
        List<ParcelResponseDto> response = parcelService.convertToDtoList(parcels);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/sent")
    @Operation(summary = "Get sent parcels", description = "Get all parcels sent by the authenticated user")
    public ResponseEntity<List<ParcelResponseDto>> getSentParcels(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Parcel> parcels = parcelService.findBySender(currentUser);
        List<ParcelResponseDto> response = parcelService.convertToDtoList(parcels);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/received")
    @Operation(summary = "Get received parcels", description = "Get all parcels received by the authenticated user")
    public ResponseEntity<List<ParcelResponseDto>> getReceivedParcels(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Parcel> parcels = parcelService.findByReceiver(currentUser);
        List<ParcelResponseDto> response = parcelService.convertToDtoList(parcels);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get parcel by ID", description = "Get parcel details by ID")
    public ResponseEntity<?> getParcelById(@PathVariable Long id, Authentication authentication) {
        Optional<Parcel> parcelOpt = parcelService.findById(id);
        
        if (parcelOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Parcel not found");
            return ResponseEntity.notFound().build();
        }
        
        Parcel parcel = parcelOpt.get();
        User currentUser = (User) authentication.getPrincipal();
        
        // Check if user has permission to view this parcel
        if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
            !currentUser.getRole().equals(User.UserRole.STAFF) &&
            !parcel.getSender().getId().equals(currentUser.getId()) &&
            !parcel.getReceiver().getId().equals(currentUser.getId())) {
            return ResponseEntity.forbidden().build();
        }
        
        ParcelResponseDto response = parcelService.convertToDto(parcel);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Update parcel status", description = "Update parcel status (Admin/Staff only)")
    public ResponseEntity<?> updateParcelStatus(@PathVariable Long id, 
                                               @RequestParam Parcel.ParcelStatus status,
                                               Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Parcel updatedParcel = parcelService.updateParcelStatus(id, status, currentUser);
            ParcelResponseDto response = parcelService.convertToDto(updatedParcel);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get all parcels", description = "Get all parcels (Admin/Staff only)")
    public ResponseEntity<List<ParcelResponseDto>> getAllParcels() {
        List<Parcel> parcels = parcelService.findAll();
        List<ParcelResponseDto> response = parcelService.convertToDtoList(parcels);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get parcels by status", description = "Get all parcels with specific status (Admin/Staff only)")
    public ResponseEntity<List<ParcelResponseDto>> getParcelsByStatus(@PathVariable Parcel.ParcelStatus status) {
        List<Parcel> parcels = parcelService.findByStatus(status);
        List<ParcelResponseDto> response = parcelService.convertToDtoList(parcels);
        return ResponseEntity.ok(response);
    }
}