package com.parcelmanagement.repository;

import com.parcelmanagement.entity.Invoice;
import com.parcelmanagement.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    Optional<Invoice> findByParcel(Parcel parcel);
    
    List<Invoice> findByPaymentStatus(Invoice.PaymentStatus paymentStatus);
    
    @Query("SELECT i FROM Invoice i WHERE i.parcel.sender.id = :senderId")
    List<Invoice> findBySenderId(@Param("senderId") Long senderId);
    
    @Query("SELECT i FROM Invoice i WHERE i.issuedDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByIssuedDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :currentDate AND i.paymentStatus = 'PENDING'")
    List<Invoice> findOverdueInvoices(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.paymentStatus = 'PAID' AND i.paidDate BETWEEN :startDate AND :endDate")
    Double getTotalRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}