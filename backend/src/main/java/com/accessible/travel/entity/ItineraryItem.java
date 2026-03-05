package com.accessible.travel.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "itinerary_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(name = "day_number")
    private Integer dayNumber;

    @Column(length = 500)
    private String notes;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
