package com.accessible.travel.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "place_accessibility")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceAccessibility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "place_id", nullable = false, unique = true)
    private Place place;

    @Column(name = "wheelchair_accessible")
    @Builder.Default
    private Boolean wheelchairAccessible = false;

    @Column(name = "braille_menu")
    @Builder.Default
    private Boolean brailleMenu = false;

    @Column(name = "accessible_restroom")
    @Builder.Default
    private Boolean accessibleRestroom = false;

    @Column(name = "step_free_entry")
    @Builder.Default
    private Boolean stepFreeEntry = false;
}
