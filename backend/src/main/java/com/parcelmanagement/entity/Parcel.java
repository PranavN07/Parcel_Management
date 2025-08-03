package com.parcelmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "parcels")
public class Parcel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String trackingNumber;
    
    @NotBlank
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private Double weight;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal declaredValue;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal shippingCost;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pickup_location_id", nullable = false)
    private Location pickupLocation;
    
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_location_id", nullable = false)
    private Location deliveryLocation;
    
    @Enumerated(EnumType.STRING)
    private ParcelStatus status;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    private String receiverName;
    private String receiverPhone;
    private String receiverEmail;
    
    private String specialInstructions;
    
    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;
    
    @Column(name = "actual_delivery_date")
    private LocalDateTime actualDeliveryDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tracking> trackingHistory;
    
    @OneToOne(mappedBy = "parcel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Invoice invoice;
    
    public enum ParcelStatus {
        PENDING, CONFIRMED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED, CANCELLED
    }
    
    public enum Priority {
        STANDARD, EXPRESS, OVERNIGHT
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ParcelStatus.PENDING;
        }
        if (priority == null) {
            priority = Priority.STANDARD;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Parcel() {}
    
    public Parcel(String trackingNumber, String description, Double weight, BigDecimal declaredValue, 
                  BigDecimal shippingCost, User sender, User receiver, Location pickupLocation, 
                  Location deliveryLocation) {
        this.trackingNumber = trackingNumber;
        this.description = description;
        this.weight = weight;
        this.declaredValue = declaredValue;
        this.shippingCost = shippingCost;
        this.sender = sender;
        this.receiver = receiver;
        this.pickupLocation = pickupLocation;
        this.deliveryLocation = deliveryLocation;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public BigDecimal getDeclaredValue() { return declaredValue; }
    public void setDeclaredValue(BigDecimal declaredValue) { this.declaredValue = declaredValue; }
    
    public BigDecimal getShippingCost() { return shippingCost; }
    public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }
    
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    
    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
    
    public Location getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(Location pickupLocation) { this.pickupLocation = pickupLocation; }
    
    public Location getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(Location deliveryLocation) { this.deliveryLocation = deliveryLocation; }
    
    public ParcelStatus getStatus() { return status; }
    public void setStatus(ParcelStatus status) { this.status = status; }
    
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    
    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
    
    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }
    
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    
    public LocalDateTime getActualDeliveryDate() { return actualDeliveryDate; }
    public void setActualDeliveryDate(LocalDateTime actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Tracking> getTrackingHistory() { return trackingHistory; }
    public void setTrackingHistory(List<Tracking> trackingHistory) { this.trackingHistory = trackingHistory; }
    
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
}