package com.accessible.travel.repository;

import com.accessible.travel.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

    @Query("SELECT i FROM Itinerary i LEFT JOIN FETCH i.items WHERE i.user.id = :userId ORDER BY i.createdAt DESC")
    List<Itinerary> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT i FROM Itinerary i LEFT JOIN FETCH i.items WHERE i.id = :id AND i.user.id = :userId")
    Optional<Itinerary> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
