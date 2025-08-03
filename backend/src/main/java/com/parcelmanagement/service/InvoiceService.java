package com.parcelmanagement.service;

import com.parcelmanagement.entity.Invoice;
import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    public Invoice generateInvoice(Parcel parcel) {
        // Check if invoice already exists for this parcel
        Optional<Invoice> existingInvoice = invoiceRepository.findByParcel(parcel);
        if (existingInvoice.isPresent()) {
            return existingInvoice.get();
        }
        
        // Calculate amounts
        BigDecimal baseAmount = parcel.getShippingCost();
        BigDecimal taxAmount = baseAmount.multiply(BigDecimal.valueOf(0.10)); // 10% tax
        BigDecimal discountAmount = BigDecimal.ZERO;
        
        Invoice invoice = new Invoice(
                generateInvoiceNumber(),
                parcel,
                baseAmount,
                taxAmount,
                discountAmount
        );
        
        invoice.calculateTotalAmount();
        
        return invoiceRepository.save(invoice);
    }
    
    public Optional<Invoice> findByInvoiceNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber);
    }
    
    public Optional<Invoice> findByParcel(Parcel parcel) {
        return invoiceRepository.findByParcel(parcel);
    }
    
    public List<Invoice> findByPaymentStatus(Invoice.PaymentStatus paymentStatus) {
        return invoiceRepository.findByPaymentStatus(paymentStatus);
    }
    
    public List<Invoice> findBySenderId(Long senderId) {
        return invoiceRepository.findBySenderId(senderId);
    }
    
    public List<Invoice> findOverdueInvoices() {
        return invoiceRepository.findOverdueInvoices(LocalDateTime.now());
    }
    
    public Invoice updatePaymentStatus(Long invoiceId, Invoice.PaymentStatus paymentStatus, Invoice.PaymentMethod paymentMethod) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        invoice.setPaymentStatus(paymentStatus);
        invoice.setPaymentMethod(paymentMethod);
        
        if (paymentStatus == Invoice.PaymentStatus.PAID) {
            invoice.setPaidDate(LocalDateTime.now());
        }
        
        return invoiceRepository.save(invoice);
    }
    
    public Double getTotalRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        Double revenue = invoiceRepository.getTotalRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }
    
    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }
    
    private String generateInvoiceNumber() {
        return "INV" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}