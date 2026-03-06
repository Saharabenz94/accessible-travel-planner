CREATE TABLE places (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(200)   NOT NULL,
    type        VARCHAR(50)    NOT NULL,
    address     VARCHAR(500),
    city        VARCHAR(100),
    country     VARCHAR(100),
    latitude    NUMERIC(9, 6),
    longitude   NUMERIC(9, 6),
    description VARCHAR(1000)
);
