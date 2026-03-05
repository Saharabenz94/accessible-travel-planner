package com.accessible.travel.controller;

import com.accessible.travel.dto.place.PlaceDto;
import com.accessible.travel.dto.place.PlaceSearchRequest;
import com.accessible.travel.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@Tag(name = "Places", description = "Search accessible places (hotels and restaurants)")
@SecurityRequirement(name = "bearerAuth")
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping("/search")
    @Operation(summary = "Search accessible places with optional filters")
    public ResponseEntity<List<PlaceDto>> search(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean wheelchairAccessible,
            @RequestParam(required = false) Boolean brailleMenu,
            @RequestParam(required = false) Boolean accessibleRestroom,
            @RequestParam(required = false) Boolean stepFreeEntry) {

        PlaceSearchRequest request = new PlaceSearchRequest();
        request.setType(type);
        request.setCity(city);
        request.setWheelchairAccessible(wheelchairAccessible);
        request.setBrailleMenu(brailleMenu);
        request.setAccessibleRestroom(accessibleRestroom);
        request.setStepFreeEntry(stepFreeEntry);

        return ResponseEntity.ok(placeService.searchPlaces(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get place details by ID")
    public ResponseEntity<PlaceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.getById(id));
    }
}
