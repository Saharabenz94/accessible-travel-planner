package com.accessible.travel.dto.place;

import lombok.Data;

@Data
public class PlaceSearchRequest {
    private String type;
    private String city;
    private Boolean wheelchairAccessible;
    private Boolean brailleMenu;
    private Boolean accessibleRestroom;
    private Boolean stepFreeEntry;
}
