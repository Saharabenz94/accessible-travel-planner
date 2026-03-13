package com.accessible.travel.dto.external;

public record CityCoordinatesDto(
        double lat,
        double lon,
        String displayName
) {}
