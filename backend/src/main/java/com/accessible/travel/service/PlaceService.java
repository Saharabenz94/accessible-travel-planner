package com.accessible.travel.service;

import com.accessible.travel.dto.place.AccessibilityDto;
import com.accessible.travel.dto.place.PlaceDto;
import com.accessible.travel.dto.place.PlaceSearchRequest;
import com.accessible.travel.entity.Place;
import com.accessible.travel.exception.ResourceNotFoundException;
import com.accessible.travel.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;

    public List<PlaceDto> searchPlaces(PlaceSearchRequest request) {
        return placeRepository.searchPlaces(
                request.getType(),
                request.getCity(),
                request.getWheelchairAccessible(),
                request.getBrailleMenu(),
                request.getAccessibleRestroom(),
                request.getStepFreeEntry()
        ).stream().map(this::toDto).toList();
    }

    public PlaceDto getById(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + id));
        return toDto(place);
    }

    public PlaceDto toDto(Place place) {
        PlaceDto dto = new PlaceDto();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setType(place.getType());
        dto.setAddress(place.getAddress());
        dto.setCity(place.getCity());
        dto.setCountry(place.getCountry());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        dto.setDescription(place.getDescription());

        if (place.getAccessibility() != null) {
            AccessibilityDto acc = new AccessibilityDto();
            acc.setWheelchairAccessible(place.getAccessibility().getWheelchairAccessible());
            acc.setBrailleMenu(place.getAccessibility().getBrailleMenu());
            acc.setAccessibleRestroom(place.getAccessibility().getAccessibleRestroom());
            acc.setStepFreeEntry(place.getAccessibility().getStepFreeEntry());
            dto.setAccessibility(acc);
        }

        return dto;
    }
}
