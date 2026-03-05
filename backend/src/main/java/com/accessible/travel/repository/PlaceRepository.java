package com.accessible.travel.repository;

import com.accessible.travel.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    @Query("""
            SELECT p FROM Place p
            LEFT JOIN FETCH p.accessibility a
            WHERE (:type IS NULL OR p.type = :type)
              AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
              AND (:wheelchairAccessible IS NULL OR a.wheelchairAccessible = :wheelchairAccessible)
              AND (:brailleMenu IS NULL OR a.brailleMenu = :brailleMenu)
              AND (:accessibleRestroom IS NULL OR a.accessibleRestroom = :accessibleRestroom)
              AND (:stepFreeEntry IS NULL OR a.stepFreeEntry = :stepFreeEntry)
            """)
    List<Place> searchPlaces(
            @Param("type") String type,
            @Param("city") String city,
            @Param("wheelchairAccessible") Boolean wheelchairAccessible,
            @Param("brailleMenu") Boolean brailleMenu,
            @Param("accessibleRestroom") Boolean accessibleRestroom,
            @Param("stepFreeEntry") Boolean stepFreeEntry
    );
}
