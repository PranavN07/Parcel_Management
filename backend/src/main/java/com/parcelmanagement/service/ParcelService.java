package com.parcelmanagement.service;

import com.parcelmanagement.dto.ParcelBookingDto;
import com.parcelmanagement.dto.ParcelResponseDto;
import com.parcelmanagement.entity.*;
import com.parcelmanagement.repository.LocationRepository;
import com.parcelmanagement.repository.ParcelRepository;
import com.parcelmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParcelService {
    
    @Autowired
    private ParcelRepository parcelRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private TrackingService trackingService;
    
    public Parcel bookParcel(ParcelBookingDto bookingDto, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found with id: " + senderId));
        
        // Find or create receiver (for now, we'll create a simple customer account)
        User receiver = findOrCreateReceiver(bookingDto);
        
        // Create pickup location
        Location pickupLocation = new Location(
                bookingDto.getPickupAddress(),
                bookingDto.getPickupCity(),
                bookingDto.getPickupState(),
                bookingDto.getPickupCountry(),
                bookingDto.getPickupZipCode()
        );
        
        // Create delivery location
        Location deliveryLocation = new Location(
                bookingDto.getDeliveryAddress(),
                bookingDto.getDeliveryCity(),
                bookingDto.getDeliveryState(),
                bookingDto.getDeliveryCountry(),
                bookingDto.getDeliveryZipCode()
        );
        
        // Calculate shipping cost based on weight and priority
        BigDecimal shippingCost = calculateShippingCost(bookingDto.getWeight(), bookingDto.getPriority());
        
        // Create parcel
        Parcel parcel = new Parcel(
                generateTrackingNumber(),
                bookingDto.getDescription(),
                bookingDto.getWeight(),
                bookingDto.getDeclaredValue(),
                shippingCost,
                sender,
                receiver,
                pickupLocation,
                deliveryLocation
        );
        
        parcel.setPriority(bookingDto.getPriority());
        parcel.setReceiverName(bookingDto.getReceiverName());
        parcel.setReceiverPhone(bookingDto.getReceiverPhone());
        parcel.setReceiverEmail(bookingDto.getReceiverEmail());
        parcel.setSpecialInstructions(bookingDto.getSpecialInstructions());
        parcel.setEstimatedDeliveryDate(calculateEstimatedDeliveryDate(bookingDto.getPriority()));
        
        Parcel savedParcel = parcelRepository.save(parcel);
        
        // Create initial tracking entry
        trackingService.addTrackingUpdate(savedParcel.getId(), Parcel.ParcelStatus.PENDING, 
                "Parcel Service Center", "Parcel booking confirmed", sender);
        
        return savedParcel;
    }
    
    public Optional<Parcel> findByTrackingNumber(String trackingNumber) {
        return parcelRepository.findByTrackingNumber(trackingNumber);
    }
    
    public Optional<Parcel> findById(Long id) {
        return parcelRepository.findById(id);
    }
    
    public List<Parcel> findByUser(User user) {
        return parcelRepository.findByUser(user);
    }
    
    public List<Parcel> findByUserId(Long userId) {
        return parcelRepository.findByUserId(userId);
    }
    
    public List<Parcel> findBySender(User sender) {
        return parcelRepository.findBySender(sender);
    }
    
    public List<Parcel> findByReceiver(User receiver) {
        return parcelRepository.findByReceiver(receiver);
    }
    
    public List<Parcel> findByStatus(Parcel.ParcelStatus status) {
        return parcelRepository.findByStatus(status);
    }
    
    public List<Parcel> findAll() {
        return parcelRepository.findAll();
    }
    
    public Parcel updateParcelStatus(Long parcelId, Parcel.ParcelStatus status, User updatedBy) {
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new RuntimeException("Parcel not found with id: " + parcelId));
        
        parcel.setStatus(status);
        
        if (status == Parcel.ParcelStatus.DELIVERED) {
            parcel.setActualDeliveryDate(LocalDateTime.now());
        }
        
        Parcel updatedParcel = parcelRepository.save(parcel);
        
        // Add tracking update
        trackingService.addTrackingUpdate(parcelId, status, 
                "System Update", "Status updated to " + status, updatedBy);
        
        return updatedParcel;
    }
    
    public ParcelResponseDto convertToDto(Parcel parcel) {
        ParcelResponseDto dto = new ParcelResponseDto();
        dto.setId(parcel.getId());
        dto.setTrackingNumber(parcel.getTrackingNumber());
        dto.setDescription(parcel.getDescription());
        dto.setWeight(parcel.getWeight());
        dto.setDeclaredValue(parcel.getDeclaredValue());
        dto.setShippingCost(parcel.getShippingCost());
        dto.setStatus(parcel.getStatus());
        dto.setPriority(parcel.getPriority());
        dto.setSenderName(parcel.getSender().getFirstName() + " " + parcel.getSender().getLastName());
        dto.setSenderEmail(parcel.getSender().getEmail());
        dto.setReceiverName(parcel.getReceiverName());
        dto.setReceiverPhone(parcel.getReceiverPhone());
        dto.setReceiverEmail(parcel.getReceiverEmail());
        dto.setPickupLocation(parcel.getPickupLocation().getFullAddress());
        dto.setDeliveryLocation(parcel.getDeliveryLocation().getFullAddress());
        dto.setSpecialInstructions(parcel.getSpecialInstructions());
        dto.setEstimatedDeliveryDate(parcel.getEstimatedDeliveryDate());
        dto.setActualDeliveryDate(parcel.getActualDeliveryDate());
        dto.setCreatedAt(parcel.getCreatedAt());
        dto.setUpdatedAt(parcel.getUpdatedAt());
        return dto;
    }
    
    public List<ParcelResponseDto> convertToDtoList(List<Parcel> parcels) {
        return parcels.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private User findOrCreateReceiver(ParcelBookingDto bookingDto) {
        // For simplicity, we'll create a basic customer user if email is provided
        if (bookingDto.getReceiverEmail() != null && !bookingDto.getReceiverEmail().isEmpty()) {
            Optional<User> existingUser = userRepository.findByEmail(bookingDto.getReceiverEmail());
            if (existingUser.isPresent()) {
                return existingUser.get();
            }
        }
        
        // Create a basic receiver user
        User receiver = new User();
        receiver.setUsername("receiver_" + UUID.randomUUID().toString().substring(0, 8));
        receiver.setEmail(bookingDto.getReceiverEmail() != null ? bookingDto.getReceiverEmail() : "noemail@example.com");
        receiver.setPassword("defaultPassword123"); // This should be handled properly in production
        receiver.setFirstName(bookingDto.getReceiverName().split(" ")[0]);
        receiver.setLastName(bookingDto.getReceiverName().contains(" ") ? 
                bookingDto.getReceiverName().substring(bookingDto.getReceiverName().indexOf(" ") + 1) : "");
        receiver.setPhoneNumber(bookingDto.getReceiverPhone());
        receiver.setRole(User.UserRole.CUSTOMER);
        receiver.setEnabled(true);
        
        return userRepository.save(receiver);
    }
    
    private String generateTrackingNumber() {
        return "TRK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private BigDecimal calculateShippingCost(Double weight, Parcel.Priority priority) {
        BigDecimal baseCost = BigDecimal.valueOf(5.0); // Base cost
        BigDecimal weightCost = BigDecimal.valueOf(weight * 2.0); // $2 per kg
        
        BigDecimal priorityMultiplier;
        switch (priority) {
            case EXPRESS:
                priorityMultiplier = BigDecimal.valueOf(1.5);
                break;
            case OVERNIGHT:
                priorityMultiplier = BigDecimal.valueOf(2.0);
                break;
            default:
                priorityMultiplier = BigDecimal.valueOf(1.0);
        }
        
        return baseCost.add(weightCost).multiply(priorityMultiplier);
    }
    
    private LocalDateTime calculateEstimatedDeliveryDate(Parcel.Priority priority) {
        LocalDateTime now = LocalDateTime.now();
        switch (priority) {
            case OVERNIGHT:
                return now.plusDays(1);
            case EXPRESS:
                return now.plusDays(2);
            default:
                return now.plusDays(5);
        }
    }
}