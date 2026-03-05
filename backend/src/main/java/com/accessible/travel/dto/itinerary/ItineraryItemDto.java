package com.accessible.travel.dto.itinerary;

import com.accessible.travel.dto.place.PlaceDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryItemDto {
    private Long id;
    private PlaceDto place;
    private Integer dayNumber;
    private String notes;
    private Integer sortOrder;
}
