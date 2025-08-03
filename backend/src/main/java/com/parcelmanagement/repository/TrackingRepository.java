package com.parcelmanagement.repository;

import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.entity.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrackingRepository extends JpaRepository<Tracking, Long> {
    
    List<Tracking> findByParcel(Parcel parcel);
    
    List<Tracking> findByParcelOrderByTimestampDesc(Parcel parcel);
    
    @Query("SELECT t FROM Tracking t WHERE t.parcel.trackingNumber = :trackingNumber ORDER BY t.timestamp DESC")
    List<Tracking> findByTrackingNumberOrderByTimestampDesc(@Param("trackingNumber") String trackingNumber);
    
    @Query("SELECT t FROM Tracking t WHERE t.parcel.id = :parcelId ORDER BY t.timestamp DESC")
    List<Tracking> findByParcelIdOrderByTimestampDesc(@Param("parcelId") Long parcelId);
    
    @Query("SELECT t FROM Tracking t WHERE t.timestamp BETWEEN :startDate AND :endDate ORDER BY t.timestamp DESC")
    List<Tracking> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Tracking t WHERE t.parcel = :parcel AND t.status = :status ORDER BY t.timestamp DESC")
    List<Tracking> findByParcelAndStatus(@Param("parcel") Parcel parcel, @Param("status") Parcel.ParcelStatus status);
}