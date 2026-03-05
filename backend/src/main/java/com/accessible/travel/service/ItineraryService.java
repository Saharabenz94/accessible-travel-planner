package com.accessible.travel.service;

import com.accessible.travel.dto.itinerary.*;
import com.accessible.travel.entity.Itinerary;
import com.accessible.travel.entity.ItineraryItem;
import com.accessible.travel.entity.Place;
import com.accessible.travel.entity.User;
import com.accessible.travel.exception.ResourceNotFoundException;
import com.accessible.travel.repository.ItineraryRepository;
import com.accessible.travel.repository.PlaceRepository;
import com.accessible.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;
    private final PlaceService placeService;

    @Transactional
    public ItineraryDto createItinerary(String userEmail, CreateItineraryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Itinerary itinerary = Itinerary.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return toDto(itineraryRepository.save(itinerary));
    }

    @Transactional(readOnly = true)
    public List<ItineraryDto> getItinerariesForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return itineraryRepository.findAllByUserId(user.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ItineraryDto getItinerary(String userEmail, Long itineraryId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        Itinerary itinerary = itineraryRepository.findByIdAndUserId(itineraryId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + itineraryId));
        return toDto(itinerary);
    }

    @Transactional
    public ItineraryDto addItem(String userEmail, Long itineraryId, AddItineraryItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        Itinerary itinerary = itineraryRepository.findByIdAndUserId(itineraryId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + itineraryId));
        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + request.getPlaceId()));

        ItineraryItem item = ItineraryItem.builder()
                .itinerary(itinerary)
                .place(place)
                .dayNumber(request.getDayNumber())
                .notes(request.getNotes())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        itinerary.getItems().add(item);
        return toDto(itineraryRepository.save(itinerary));
    }

    @Transactional
    public void deleteItinerary(String userEmail, Long itineraryId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        Itinerary itinerary = itineraryRepository.findByIdAndUserId(itineraryId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + itineraryId));
        itineraryRepository.delete(itinerary);
    }

    private ItineraryDto toDto(Itinerary itinerary) {
        return ItineraryDto.builder()
                .id(itinerary.getId())
                .title(itinerary.getTitle())
                .description(itinerary.getDescription())
                .startDate(itinerary.getStartDate())
                .endDate(itinerary.getEndDate())
                .createdAt(itinerary.getCreatedAt())
                .items(itinerary.getItems().stream()
                        .map(item -> ItineraryItemDto.builder()
                                .id(item.getId())
                                .place(placeService.toDto(item.getPlace()))
                                .dayNumber(item.getDayNumber())
                                .notes(item.getNotes())
                                .sortOrder(item.getSortOrder())
                                .build())
                        .toList())
                .build();
    }
}
