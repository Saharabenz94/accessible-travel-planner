export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  brailleMenu: boolean;
  accessibleRestroom: boolean;
  stepFreeEntry: boolean;
}

export interface Place {
  id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  accessibility: AccessibilityFeatures;
}

export interface ItineraryItem {
  id: number;
  place: Place;
  dayNumber: number | null;
  notes: string | null;
  sortOrder: number;
}

export interface Itinerary {
  id: number;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  items: ItineraryItem[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
