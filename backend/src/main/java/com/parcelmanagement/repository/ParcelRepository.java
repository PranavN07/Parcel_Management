package com.parcelmanagement.repository;

import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    
    Optional<Parcel> findByTrackingNumber(String trackingNumber);
    
    List<Parcel> findBySender(User sender);
    
    List<Parcel> findByReceiver(User receiver);
    
    List<Parcel> findByStatus(Parcel.ParcelStatus status);
    
    @Query("SELECT p FROM Parcel p WHERE p.sender = :user OR p.receiver = :user")
    List<Parcel> findByUser(@Param("user") User user);
    
    @Query("SELECT p FROM Parcel p WHERE p.sender.id = :userId OR p.receiver.id = :userId")
    List<Parcel> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Parcel p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Parcel> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Parcel p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Parcel> findByStatusAndDateRange(@Param("status") Parcel.ParcelStatus status, 
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Parcel p WHERE p.status = :status")
    Long countByStatus(@Param("status") Parcel.ParcelStatus status);
    
    @Query("SELECT p FROM Parcel p WHERE p.estimatedDeliveryDate < :date AND p.status NOT IN ('DELIVERED', 'CANCELLED')")
    List<Parcel> findOverdueParcels(@Param("date") LocalDateTime date);
}