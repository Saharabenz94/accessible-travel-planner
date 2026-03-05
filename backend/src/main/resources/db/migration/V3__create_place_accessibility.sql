CREATE TABLE place_accessibility (
    id                   BIGSERIAL PRIMARY KEY,
    place_id             BIGINT  NOT NULL UNIQUE REFERENCES places (id) ON DELETE CASCADE,
    wheelchair_accessible BOOLEAN NOT NULL DEFAULT FALSE,
    braille_menu         BOOLEAN NOT NULL DEFAULT FALSE,
    accessible_restroom  BOOLEAN NOT NULL DEFAULT FALSE,
    step_free_entry      BOOLEAN NOT NULL DEFAULT FALSE
);
