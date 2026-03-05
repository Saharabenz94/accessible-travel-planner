import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getItinerary, getItineraries } from '../api';
import type { Itinerary, Place } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const itineraryId = searchParams.get('itinerary');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getItineraries()
      .then(setItineraries)
      .catch(() => setError('Failed to load itineraries'));
  }, []);

  useEffect(() => {
    if (itineraryId) {
      getItinerary(Number(itineraryId))
        .then(setItinerary)
        .catch(() => setError('Failed to load itinerary'));
    }
  }, [itineraryId]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const places: Place[] = itinerary
      ? itinerary.items.map((item) => item.place)
      : itineraries.flatMap((it) => it.items.map((item) => item.place));

    const uniquePlaces = Array.from(new Map(places.map((p) => [p.id, p])).values());

    if (uniquePlaces.length > 0) {
      const bounds: [number, number][] = [];
      uniquePlaces.forEach((place) => {
        if (place.latitude && place.longitude) {
          const marker = L.marker([Number(place.latitude), Number(place.longitude)]);
          marker.bindPopup(`
            <strong>${place.name}</strong><br/>
            ${place.type === 'hotel' ? '🏨' : '🍽️'} ${place.type}<br/>
            📍 ${place.city}, ${place.country}<br/>
            ${place.accessibility?.wheelchairAccessible ? '♿ ' : ''}
            ${place.accessibility?.brailleMenu ? '⬛ ' : ''}
            ${place.accessibility?.accessibleRestroom ? '🚻 ' : ''}
            ${place.accessibility?.stepFreeEntry ? '🚪' : ''}
          `);
          marker.addTo(map);
          bounds.push([Number(place.latitude), Number(place.longitude)]);
        }
      });
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [itinerary, itineraries]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>🗺️ Map View</h2>
        {itineraries.length > 0 && (
          <div className="map-itinerary-select">
            <label>Show itinerary: </label>
            <select
              value={itineraryId || ''}
              onChange={(e) => {
                const val = e.target.value;
                window.history.pushState({}, '', val ? `/map?itinerary=${val}` : '/map');
                if (val) {
                  getItinerary(Number(val)).then(setItinerary).catch(() => setError('Failed to load itinerary'));
                } else {
                  setItinerary(null);
                }
              }}
            >
              <option value="">All saved places</option>
              {itineraries.map((it) => (
                <option key={it.id} value={it.id}>{it.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {itinerary && (
        <div className="map-legend">
          Showing {itinerary.items.length} place{itinerary.items.length !== 1 ? 's' : ''} from <strong>{itinerary.title}</strong>
        </div>
      )}

      <div ref={mapRef} className="map-container" />

      <p className="map-hint">
        💡 Add places from the <Link to="/places">Search</Link> page, then view them on the map here.
      </p>
    </div>
  );
}
