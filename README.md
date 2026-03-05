# Accessible Travel Planner

A full-stack web application for planning accessible travel. Find wheelchair-accessible hotels and restaurants, build itineraries, and view your saved places on an interactive map.

---

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Backend     | Java 21, Spring Boot 3, Spring Security, JWT  |
| Frontend    | React 18, TypeScript, Vite, React Router      |
| Database    | PostgreSQL 16, Flyway migrations              |
| Map         | Leaflet + OpenStreetMap tiles                 |
| Docs        | Swagger / OpenAPI 3                           |
| Infrastructure | Docker Compose                             |

---

## Features

- **User Authentication** – Register and login with JWT-protected endpoints
- **Accessible Places Search** – Search hotels and restaurants with accessibility filters:
  - ♿ Wheelchair Accessible
  - ⬛ Braille Menu
  - 🚻 Accessible Restroom
  - 🚪 Step-Free Entry
- **Travel Itinerary** – Create itineraries, add places, view and delete them
- **Map View** – Interactive Leaflet map with OpenStreetMap tiles showing saved places

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

---

## Quick Start (Docker Compose)

```bash
# Clone the repository
git clone https://github.com/Saharabenz94/accessible-travel-planner.git
cd accessible-travel-planner

# Start all services
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

Once running:

| Service        | URL                                             |
|----------------|-------------------------------------------------|
| Frontend       | http://localhost:3000                           |
| Backend API    | http://localhost:8080/api                       |
| Swagger UI     | http://localhost:8080/api/swagger-ui.html       |
| OpenAPI Docs   | http://localhost:8080/api/v3/api-docs           |

---

## Local Development (without Docker)

### Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 16+

### Backend

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE traveldb;"

# Run the backend
cd backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:3000` and proxies `/api` calls to the backend.

---

## Database Schema

| Table               | Description                          |
|---------------------|--------------------------------------|
| `users`             | Registered users                     |
| `places`            | Hotels and restaurants               |
| `place_accessibility` | Accessibility features per place   |
| `itineraries`       | User travel itineraries              |
| `itinerary_items`   | Places added to an itinerary         |

Flyway migrations are in `backend/src/main/resources/db/migration/`. Seed data with ~30 accessible places is loaded automatically on first run.

---

## API Endpoints

All endpoints are under `/api`. Authentication endpoints are public; all others require a `Bearer` JWT token.

### Authentication

| Method | Path                | Description         |
|--------|---------------------|---------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login               |

### Places

| Method | Path                | Description                              |
|--------|---------------------|------------------------------------------|
| GET    | `/api/places/search` | Search places with accessibility filters |
| GET    | `/api/places/{id}`  | Get place by ID                          |

**Search query parameters:** `type`, `city`, `wheelchairAccessible`, `brailleMenu`, `accessibleRestroom`, `stepFreeEntry`

### Itineraries

| Method | Path                          | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | `/api/itineraries`            | Create a new itinerary          |
| GET    | `/api/itineraries`            | List itineraries for logged-in user |
| GET    | `/api/itineraries/{id}`       | Get a specific itinerary        |
| POST   | `/api/itineraries/{id}/items` | Add a place to an itinerary     |
| DELETE | `/api/itineraries/{id}`       | Delete an itinerary             |

---

## Environment Variables

| Variable      | Default                                    | Description                  |
|---------------|--------------------------------------------|------------------------------|
| `DB_HOST`     | `localhost`                                | PostgreSQL host              |
| `DB_PORT`     | `5432`                                     | PostgreSQL port              |
| `DB_NAME`     | `traveldb`                                 | Database name                |
| `DB_USER`     | `postgres`                                 | Database user                |
| `DB_PASSWORD` | `postgres`                                 | Database password            |
| `JWT_SECRET`  | (hex string in config)                     | JWT signing secret           |

---

## Project Structure

```
accessible-travel-planner/
├── backend/                         # Spring Boot backend
│   ├── src/main/java/com/accessible/travel/
│   │   ├── config/                  # Security, OpenAPI config
│   │   ├── controller/              # REST controllers
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── entity/                  # JPA entities
│   │   ├── exception/               # Global exception handler
│   │   ├── repository/              # Spring Data repositories
│   │   ├── security/                # JWT filter, provider, UserDetailsService
│   │   └── service/                 # Business logic
│   └── src/main/resources/
│       ├── application.yml          # Configuration
│       └── db/migration/            # Flyway SQL migrations + seed data
├── frontend/                        # React + TypeScript frontend
│   └── src/
│       ├── api/                     # Axios API client
│       ├── components/              # Navbar, ProtectedRoute
│       ├── contexts/                # AuthContext
│       ├── pages/                   # LoginPage, RegisterPage, PlacesPage, ItineraryPage, MapPage
│       └── types/                   # TypeScript interfaces
├── docker-compose.yml
└── README.md
```

---

## Stopping Services

```bash
docker compose down          # stop and remove containers
docker compose down -v       # also remove the database volume
```

