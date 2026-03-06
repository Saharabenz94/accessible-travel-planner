import api from './axios';
import type { AuthResponse, Place, Itinerary } from '../types';

// Auth
export const register = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data);

// Places
export interface PlaceSearchParams {
  type?: string;
  city?: string;
  wheelchairAccessible?: boolean;
  brailleMenu?: boolean;
  accessibleRestroom?: boolean;
  stepFreeEntry?: boolean;
}

export const searchPlaces = (params: PlaceSearchParams) =>
  api.get<Place[]>('/places/search', { params }).then((r) => r.data);

export const getPlace = (id: number) =>
  api.get<Place>(`/places/${id}`).then((r) => r.data);

// Itineraries
export const getItineraries = () =>
  api.get<Itinerary[]>('/itineraries').then((r) => r.data);

export const getItinerary = (id: number) =>
  api.get<Itinerary>(`/itineraries/${id}`).then((r) => r.data);

export const createItinerary = (data: {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}) => api.post<Itinerary>('/itineraries', data).then((r) => r.data);

export const addItineraryItem = (
  itineraryId: number,
  data: { placeId: number; dayNumber?: number; notes?: string; sortOrder?: number }
) =>
  api.post<Itinerary>(`/itineraries/${itineraryId}/items`, data).then((r) => r.data);

export const deleteItinerary = (id: number) =>
  api.delete(`/itineraries/${id}`).then((r) => r.data);
