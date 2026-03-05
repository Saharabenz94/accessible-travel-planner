package com.accessible.travel.dto.itinerary;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddItineraryItemRequest {

    @NotNull(message = "Place ID is required")
    private Long placeId;

    private Integer dayNumber;

    private String notes;

    private Integer sortOrder;
}
