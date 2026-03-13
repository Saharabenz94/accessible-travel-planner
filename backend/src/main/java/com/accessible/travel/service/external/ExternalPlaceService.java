package com.accessible.travel.service.external;

import com.accessible.travel.dto.external.CityCoordinatesDto;
import com.accessible.travel.dto.external.ExternalPlaceDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalPlaceService {

    private static final String NOMINATIM_URL =
            "https://nominatim.openstreetmap.org/search?format=json&limit=1&q={city}";

    private static final String OVERPASS_URL = "https://overpass-api.de/api/interpreter";

    private static final String USER_AGENT =
            "accessible-travel-planner/1.0 (student-portfolio; +https://github.com/Saharabenz94/accessible-travel-planner)";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ExternalPlaceService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<ExternalPlaceDto> searchPlaces(String city, String type) {
        if (city == null || city.isBlank()) {
            return Collections.emptyList();
        }

        String normalizedType = normalizeType(type);

        CityCoordinatesDto coords = getCityCoordinates(city);
        if (coords == null) {
            return Collections.emptyList();
        }

        try {
            String query = buildOverpassQuery(normalizedType, coords.lat(), coords.lon());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("User-Agent", USER_AGENT);

            // Overpass expects the query in the "data" form parameter.
            String body = "data=" + URLEncoder.encode(query, StandardCharsets.UTF_8);

            ResponseEntity<String> response = restTemplate.exchange(
                    OVERPASS_URL,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class
            );

            String json = response.getBody();
            if (json == null || json.isBlank()) {
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(json);
            JsonNode elements = root.path("elements");
            if (!elements.isArray()) {
                return Collections.emptyList();
            }

            List<ExternalPlaceDto> results = new ArrayList<>();
            for (JsonNode element : elements) {
                ExternalPlaceDto dto = mapElementToDto(element, city, normalizedType);
                if (dto != null) {
                    results.add(dto);
                }
            }

            return results;
        } catch (Exception e) {
            // Keep it safe for a portfolio project: don't crash the app on external API issues.
            return Collections.emptyList();
        }
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) {
            return "hotel";
        }

        String t = type.trim().toLowerCase();
        if (t.contains("rest")) {
            return "restaurant";
        }
        if (t.contains("hotel")) {
            return "hotel";
        }

        // Default to hotel for deterministic behavior.
        return "hotel";
    }

    private CityCoordinatesDto getCityCoordinates(String city) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("User-Agent", USER_AGENT);

            ResponseEntity<String> response = restTemplate.exchange(
                    NOMINATIM_URL,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class,
                    city
            );

            String json = response.getBody();
            if (json == null || json.isBlank()) {
                return null;
            }

            JsonNode root = objectMapper.readTree(json);
            if (!root.isArray() || root.isEmpty()) {
                return null;
            }

            JsonNode first = root.get(0);
            Double lat = tryParseDouble(first.path("lat").asText(null));
            Double lon = tryParseDouble(first.path("lon").asText(null));

            if (lat == null || lon == null) {
                return null;
            }

            return new CityCoordinatesDto(lat, lon);
        } catch (Exception e) {
            return null;
        }
    }

    private String buildOverpassQuery(String normalizedType, double lat, double lon) {
        String filter = Objects.equals(normalizedType, "restaurant")
                ? "[\"amenity\"=\"restaurant\"]"
                : "[\"tourism\"=\"hotel\"]";

        // We request node/way/relation per requirements, but we will skip way/relation results
        // that don't include lat/lon directly.
        return "[out:json][timeout:25];("
                + "node" + filter + "(around:5000," + lat + "," + lon + ");"
                + "way" + filter + "(around:5000," + lat + "," + lon + ");"
                + "relation" + filter + "(around:5000," + lat + "," + lon + ");"
                + ");out body;";
    }

    private ExternalPlaceDto mapElementToDto(JsonNode element, String city, String normalizedType) {
        try {
            JsonNode latNode = element.get("lat");
            JsonNode lonNode = element.get("lon");

            // Ways/relations often don't have lat/lon directly; skip them for now.
            if (latNode == null || lonNode == null || !latNode.isNumber() || !lonNode.isNumber()) {
                return null;
            }

            double lat = latNode.asDouble();
            double lon = lonNode.asDouble();

            JsonNode tags = element.path("tags");

            String name = tags.path("name").asText("Unnamed place");
            String address = tags.path("addr:street").asText("Address unavailable");
            String country = tags.path("addr:country").asText("");

            ExternalPlaceDto dto = new ExternalPlaceDto();
            dto.setName(name);
            dto.setType(normalizedType);
            dto.setAddress(address);
            dto.setCity(city);
            dto.setCountry(country);
            dto.setLatitude(lat);
            dto.setLongitude(lon);
            dto.setDescription("Live place data from OpenStreetMap");
            dto.setSource("OpenStreetMap/Overpass");

            return dto;
        } catch (Exception e) {
            return null;
        }
    }

    private Double tryParseDouble(String value) {
        try {
            if (value == null || value.isBlank()) {
                return null;
            }
            return Double.parseDouble(value);
        } catch (Exception e) {
            return null;
        }
    }
}
