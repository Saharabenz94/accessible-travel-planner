CREATE TABLE itineraries (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    start_date  DATE,
    end_date    DATE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
