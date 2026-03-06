package com.accessible.travel.controller;

import com.accessible.travel.dto.itinerary.AddItineraryItemRequest;
import com.accessible.travel.dto.itinerary.CreateItineraryRequest;
import com.accessible.travel.dto.itinerary.ItineraryDto;
import com.accessible.travel.service.ItineraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
@Tag(name = "Itineraries", description = "Manage travel itineraries")
@SecurityRequirement(name = "bearerAuth")
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping
    @Operation(summary = "Create a new itinerary")
    public ResponseEntity<ItineraryDto> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateItineraryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itineraryService.createItinerary(user.getUsername(), request));
    }

    @GetMapping
    @Operation(summary = "Get all itineraries for the logged-in user")
    public ResponseEntity<List<ItineraryDto>> getAll(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(itineraryService.getItinerariesForUser(user.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific itinerary by ID")
    public ResponseEntity<ItineraryDto> getById(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(itineraryService.getItinerary(user.getUsername(), id));
    }

    @PostMapping("/{id}/items")
    @Operation(summary = "Add a place to an itinerary")
    public ResponseEntity<ItineraryDto> addItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @Valid @RequestBody AddItineraryItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itineraryService.addItem(user.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an itinerary")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        itineraryService.deleteItinerary(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
