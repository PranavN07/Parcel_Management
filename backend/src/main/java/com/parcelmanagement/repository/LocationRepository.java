package com.parcelmanagement.repository;

import com.parcelmanagement.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    List<Location> findByCity(String city);
    
    List<Location> findByState(String state);
    
    List<Location> findByCountry(String country);
    
    List<Location> findByZipCode(String zipCode);
    
    @Query("SELECT l FROM Location l WHERE l.city = :city AND l.state = :state")
    List<Location> findByCityAndState(@Param("city") String city, @Param("state") String state);
    
    @Query("SELECT l FROM Location l WHERE l.address LIKE %:address%")
    List<Location> findByAddressContaining(@Param("address") String address);
}