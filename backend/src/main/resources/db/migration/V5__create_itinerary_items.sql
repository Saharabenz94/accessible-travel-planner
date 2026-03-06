CREATE TABLE itinerary_items (
    id            BIGSERIAL PRIMARY KEY,
    itinerary_id  BIGINT NOT NULL REFERENCES itineraries (id) ON DELETE CASCADE,
    place_id      BIGINT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
    day_number    INTEGER,
    notes         VARCHAR(500),
    sort_order    INTEGER NOT NULL DEFAULT 0
);
