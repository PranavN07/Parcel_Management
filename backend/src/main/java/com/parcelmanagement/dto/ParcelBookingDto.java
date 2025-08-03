package com.parcelmanagement.dto;

import com.parcelmanagement.entity.Parcel;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ParcelBookingDto {
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Weight must be greater than 0")
    private Double weight;
    
    @NotNull(message = "Declared value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Declared value must be greater than 0")
    private BigDecimal declaredValue;
    
    private Parcel.Priority priority = Parcel.Priority.STANDARD;
    
    // Receiver Information
    @NotBlank(message = "Receiver name is required")
    private String receiverName;
    
    @NotBlank(message = "Receiver phone is required")
    private String receiverPhone;
    
    private String receiverEmail;
    
    // Pickup Location
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;
    
    @NotBlank(message = "Pickup city is required")
    private String pickupCity;
    
    @NotBlank(message = "Pickup state is required")
    private String pickupState;
    
    @NotBlank(message = "Pickup country is required")
    private String pickupCountry;
    
    @NotBlank(message = "Pickup zip code is required")
    private String pickupZipCode;
    
    // Delivery Location
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    @NotBlank(message = "Delivery city is required")
    private String deliveryCity;
    
    @NotBlank(message = "Delivery state is required")
    private String deliveryState;
    
    @NotBlank(message = "Delivery country is required")
    private String deliveryCountry;
    
    @NotBlank(message = "Delivery zip code is required")
    private String deliveryZipCode;
    
    private String specialInstructions;
    
    // Constructors
    public ParcelBookingDto() {}
    
    // Getters and Setters
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public BigDecimal getDeclaredValue() { return declaredValue; }
    public void setDeclaredValue(BigDecimal declaredValue) { this.declaredValue = declaredValue; }
    
    public Parcel.Priority getPriority() { return priority; }
    public void setPriority(Parcel.Priority priority) { this.priority = priority; }
    
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    
    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
    
    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }
    
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    
    public String getPickupCity() { return pickupCity; }
    public void setPickupCity(String pickupCity) { this.pickupCity = pickupCity; }
    
    public String getPickupState() { return pickupState; }
    public void setPickupState(String pickupState) { this.pickupState = pickupState; }
    
    public String getPickupCountry() { return pickupCountry; }
    public void setPickupCountry(String pickupCountry) { this.pickupCountry = pickupCountry; }
    
    public String getPickupZipCode() { return pickupZipCode; }
    public void setPickupZipCode(String pickupZipCode) { this.pickupZipCode = pickupZipCode; }
    
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    
    public String getDeliveryCity() { return deliveryCity; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }
    
    public String getDeliveryState() { return deliveryState; }
    public void setDeliveryState(String deliveryState) { this.deliveryState = deliveryState; }
    
    public String getDeliveryCountry() { return deliveryCountry; }
    public void setDeliveryCountry(String deliveryCountry) { this.deliveryCountry = deliveryCountry; }
    
    public String getDeliveryZipCode() { return deliveryZipCode; }
    public void setDeliveryZipCode(String deliveryZipCode) { this.deliveryZipCode = deliveryZipCode; }
    
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}