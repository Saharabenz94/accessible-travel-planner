-- Seed data: ~30 accessible places (hotels and restaurants) across major cities

INSERT INTO places (name, type, address, city, country, latitude, longitude, description) VALUES
-- Hotels
('The Accessible Grand Hotel', 'hotel', '10 Park Avenue', 'New York', 'USA', 40.748817, -73.985428, 'Luxury hotel with full accessibility features in the heart of Manhattan.'),
('Inclusive Stay London', 'hotel', '22 Baker Street', 'London', 'UK', 51.521260, -0.157080, 'Award-winning accessible hotel near major London attractions.'),
('Barrier-Free Boutique Paris', 'hotel', '15 Rue de Rivoli', 'Paris', 'France', 48.860294, 2.347073, 'Elegant boutique hotel with roll-in showers and tactile flooring.'),
('Access All Areas Hotel', 'hotel', '8 Main Street', 'Sydney', 'Australia', -33.868820, 151.209296, 'Modern hotel designed from the ground up for accessibility.'),
('Equal Access Hotel Tokyo', 'hotel', '3-5 Marunouchi', 'Tokyo', 'Japan', 35.681236, 139.767125, 'Business hotel with comprehensive accessibility support.'),
('Freedom Stay Berlin', 'hotel', '44 Unter den Linden', 'Berlin', 'Germany', 52.516273, 13.401279, 'Centrally located hotel fully equipped for guests with disabilities.'),
('Open Doors Hotel Barcelona', 'hotel', '25 Las Ramblas', 'Barcelona', 'Spain', 41.381494, 2.178340, 'Beachside hotel with accessible rooms and pool lift.'),
('Inclusive Palms Miami', 'hotel', '100 Ocean Drive', 'Miami', 'USA', 25.782551, -80.130045, 'Beachfront hotel with wide corridors and accessible beach path.'),
('UniversalComfort Amsterdam', 'hotel', '7 Damrak', 'Amsterdam', 'Netherlands', 52.377956, 4.897070, 'Canal-side hotel with step-free access throughout.'),
('All Welcome Suites Chicago', 'hotel', '200 Michigan Avenue', 'Chicago', 'USA', 41.886116, -87.624523, 'Full-service hotel with hearing loop and visual fire alarms.'),

-- Restaurants
('Open Table Bistro', 'restaurant', '55 5th Avenue', 'New York', 'USA', 40.739750, -73.990570, 'Spacious bistro with wide aisles, accessible restrooms and braille menus.'),
('The Inclusive Kitchen', 'restaurant', '30 Oxford Street', 'London', 'UK', 51.515530, -0.143240, 'Farm-to-table restaurant with step-free entrance and tactile menus.'),
('Accessible Brasserie', 'restaurant', '40 Boulevard Haussmann', 'Paris', 'France', 48.875000, 2.339200, 'Classic French brasserie with lift access and braille menus.'),
('Open Plate Sydney', 'restaurant', '5 Circular Quay', 'Sydney', 'Australia', -33.861400, 151.210600, 'Waterfront restaurant with full wheelchair accessibility.'),
('Equal Eats Tokyo', 'restaurant', '1-2 Ginza', 'Tokyo', 'Japan', 35.671300, 139.764700, 'Contemporary Japanese restaurant with accessible entrance and braille menu.'),
('Barrier-Free Bistro Berlin', 'restaurant', '12 Friedrichstrasse', 'Berlin', 'Germany', 52.507600, 13.388200, 'Cozy bistro with step-free entry and accessible restrooms.'),
('Accessible Tapas Barcelona', 'restaurant', '10 Passeig de Gràcia', 'Barcelona', 'Spain', 41.391600, 2.165700, 'Traditional tapas bar with ramp access and Braille menu.'),
('Inclusive Diner Miami', 'restaurant', '305 Collins Avenue', 'Miami', 'USA', 25.775200, -80.134100, 'Retro diner with level entrance and accessible booths.'),
('Open Eet Amsterdam', 'restaurant', '20 Leidseplein', 'Amsterdam', 'Netherlands', 52.363100, 4.882400, 'Dutch cuisine restaurant with low tables and wide aisles.'),
('Accessible Eats Chicago', 'restaurant', '150 N Michigan Ave', 'Chicago', 'USA', 41.884600, -87.623400, 'Modern American restaurant with full accessibility features.'),
('Ramp & Dine San Francisco', 'restaurant', '100 Market Street', 'San Francisco', 'USA', 37.794400, -122.396400, 'Farm-fresh restaurant with ramp, accessible seating and braille menu.'),
('Roll In Café Toronto', 'restaurant', '200 King Street West', 'Toronto', 'Canada', 43.644800, -79.387900, 'Accessible café with braille menu and hearing loop.'),
('Open Doors Eatery Rome', 'restaurant', '5 Via Veneto', 'Rome', 'Italy', 41.906200, 12.491400, 'Italian trattoria with step-free access and accessible restroom.'),
('Level Ground Bistro Vienna', 'restaurant', '10 Kärntner Strasse', 'Vienna', 'Austria', 48.206000, 16.371400, 'Bistro with automated door and braille menus.'),
('All Access Café Stockholm', 'restaurant', '15 Drottninggatan', 'Stockholm', 'Sweden', 59.334600, 18.063400, 'Coffee shop with level entrance, hearing loop and tactile menus.'),

-- More hotels
('Ramp & Rest Hotel San Francisco', 'hotel', '500 Union Square', 'San Francisco', 'USA', 37.788000, -122.407400, 'Downtown hotel with automated doors and roll-in showers.'),
('Welcome All Hotel Toronto', 'hotel', '88 Front Street', 'Toronto', 'Canada', 43.645700, -79.381000, 'Historic hotel renovated with full accessibility upgrades.'),
('Inclusive Heritage Rome', 'hotel', '20 Via del Corso', 'Rome', 'Italy', 41.900300, 12.480800, 'Boutique hotel in the city centre with lift and step-free rooms.'),
('Accessible Comfort Vienna', 'hotel', '3 Ringstrasse', 'Vienna', 'Austria', 48.202800, 16.366500, 'Elegant hotel near Vienna State Opera with full accessibility.'),
('Universal Welcome Stockholm', 'hotel', '30 Vasagatan', 'Stockholm', 'Sweden', 59.330900, 18.060600, 'Modern hotel with hearing loops, tactile signage, and roll-in showers.');

-- Accessibility features per place (explicit assignments for clarity)
-- Fully accessible: wheelchair + braille menu + accessible restroom + step-free entry
INSERT INTO place_accessibility (place_id, wheelchair_accessible, braille_menu, accessible_restroom, step_free_entry)
SELECT id, TRUE, TRUE, TRUE, TRUE FROM places WHERE name IN (
    'The Accessible Grand Hotel', 'Inclusive Stay London', 'Barrier-Free Boutique Paris',
    'Open Table Bistro', 'The Inclusive Kitchen', 'Accessible Brasserie',
    'Ramp & Dine San Francisco', 'Roll In Café Toronto'
);

-- Wheelchair + accessible restroom + step-free (no braille menu)
INSERT INTO place_accessibility (place_id, wheelchair_accessible, braille_menu, accessible_restroom, step_free_entry)
SELECT id, TRUE, FALSE, TRUE, TRUE FROM places WHERE name IN (
    'Access All Areas Hotel', 'Equal Access Hotel Tokyo', 'Freedom Stay Berlin',
    'Open Plate Sydney', 'Equal Eats Tokyo', 'Barrier-Free Bistro Berlin',
    'Welcome All Hotel Toronto', 'Inclusive Heritage Rome'
);

-- Wheelchair + step-free (no braille menu, no accessible restroom)
INSERT INTO place_accessibility (place_id, wheelchair_accessible, braille_menu, accessible_restroom, step_free_entry)
SELECT id, TRUE, FALSE, FALSE, TRUE FROM places WHERE name IN (
    'Open Doors Hotel Barcelona', 'Inclusive Palms Miami',
    'Accessible Tapas Barcelona', 'Inclusive Diner Miami'
);

-- Step-free + braille menu (not fully wheelchair accessible)
INSERT INTO place_accessibility (place_id, wheelchair_accessible, braille_menu, accessible_restroom, step_free_entry)
SELECT id, FALSE, TRUE, FALSE, TRUE FROM places WHERE name IN (
    'UniversalComfort Amsterdam', 'All Welcome Suites Chicago',
    'Open Eet Amsterdam', 'Accessible Eats Chicago',
    'Level Ground Bistro Vienna', 'All Access Café Stockholm'
);

-- Fully accessible (remaining hotels/restaurants)
INSERT INTO place_accessibility (place_id, wheelchair_accessible, braille_menu, accessible_restroom, step_free_entry)
SELECT id, TRUE, TRUE, TRUE, TRUE FROM places WHERE name IN (
    'Ramp & Rest Hotel San Francisco', 'Accessible Comfort Vienna', 'Universal Welcome Stockholm',
    'Open Doors Eatery Rome'
);
