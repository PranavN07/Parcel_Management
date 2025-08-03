package com.parcelmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String invoiceNumber;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private Parcel parcel;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal baseAmount;
    
    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal taxAmount;
    
    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal discountAmount;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal totalAmount;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    @Column(name = "issued_date")
    private LocalDateTime issuedDate;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "paid_date")
    private LocalDateTime paidDate;
    
    private String notes;
    
    public enum PaymentStatus {
        PENDING, PAID, OVERDUE, CANCELLED, REFUNDED
    }
    
    public enum PaymentMethod {
        CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, DIGITAL_WALLET
    }
    
    @PrePersist
    protected void onCreate() {
        if (issuedDate == null) {
            issuedDate = LocalDateTime.now();
        }
        if (dueDate == null) {
            dueDate = issuedDate.plusDays(30); // 30 days payment term
        }
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
    }
    
    // Constructors
    public Invoice() {}
    
    public Invoice(String invoiceNumber, Parcel parcel, BigDecimal baseAmount, BigDecimal taxAmount, BigDecimal discountAmount) {
        this.invoiceNumber = invoiceNumber;
        this.parcel = parcel;
        this.baseAmount = baseAmount;
        this.taxAmount = taxAmount;
        this.discountAmount = discountAmount;
        this.totalAmount = baseAmount.add(taxAmount).subtract(discountAmount);
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public Parcel getParcel() { return parcel; }
    public void setParcel(Parcel parcel) { this.parcel = parcel; }
    
    public BigDecimal getBaseAmount() { return baseAmount; }
    public void setBaseAmount(BigDecimal baseAmount) { this.baseAmount = baseAmount; }
    
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public LocalDateTime getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDateTime issuedDate) { this.issuedDate = issuedDate; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public LocalDateTime getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDateTime paidDate) { this.paidDate = paidDate; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public void calculateTotalAmount() {
        if (baseAmount != null && taxAmount != null && discountAmount != null) {
            this.totalAmount = baseAmount.add(taxAmount).subtract(discountAmount);
        }
    }
}