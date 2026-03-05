package com.accessible.travel.dto.place;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessibilityDto {
    private Boolean wheelchairAccessible;
    private Boolean brailleMenu;
    private Boolean accessibleRestroom;
    private Boolean stepFreeEntry;
}
