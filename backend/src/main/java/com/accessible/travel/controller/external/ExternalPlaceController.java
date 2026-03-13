package com.accessible.travel.controller.external;

import com.accessible.travel.dto.external.ExternalPlaceDto;
import com.accessible.travel.service.external.ExternalPlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/external/places")
public class ExternalPlaceController {

    private final ExternalPlaceService externalPlaceService;

    public ExternalPlaceController(ExternalPlaceService externalPlaceService) {
        this.externalPlaceService = externalPlaceService;
    }

    @GetMapping
    public ResponseEntity<List<ExternalPlaceDto>> searchPlaces(
            @RequestParam String city,
            @RequestParam String type
    ) {
        return ResponseEntity.ok(externalPlaceService.searchPlaces(city, type));
    }
}
