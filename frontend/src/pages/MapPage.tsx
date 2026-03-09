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

const PLACE_TYPE_ICON: Record<string, string> = {
  hotel: '🏨',
  restaurant: '🍽️',
  attraction: '🏛️',
  museum: '🏛️',
  park: '🌳',
  cafe: '☕',
  bar: '🍸',
  shopping: '🛍️',
  transport: '🚌',
};

function getTypeIcon(type: string): string {
  return PLACE_TYPE_ICON[type.toLowerCase()] ?? '📍';
}

function buildPopupContent(place: Place): string {
  const typeIcon = getTypeIcon(place.type);
  const a11y = place.accessibility;
  const tags = [
    a11y?.wheelchairAccessible && '<span class="map-popup-tag">♿ Wheelchair</span>',
    a11y?.brailleMenu && '<span class="map-popup-tag">⬛ Braille Menu</span>',
    a11y?.accessibleRestroom && '<span class="map-popup-tag">🚻 Restroom</span>',
    a11y?.stepFreeEntry && '<span class="map-popup-tag">🚪 Step-Free</span>',
  ].filter(Boolean).join('');

  return `
    <div class="map-popup">
      <div class="map-popup-title">${place.name}</div>
      <div class="map-popup-meta">${typeIcon} ${place.type} &nbsp;·&nbsp; 📍 ${place.city}, ${place.country}</div>
      ${tags ? `<div class="map-popup-tags">${tags}</div>` : ''}
    </div>
  `;
}

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const itineraryId = searchParams.get('itinerary');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  useEffect(() => {
    getItineraries()
      .then((data) => { setItineraries(data); setLoading(false); })
      .catch(() => { setError('Failed to load itineraries'); setLoading(false); });
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
    markersRef.current.clear();

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
          marker.bindPopup(buildPopupContent(place), { className: 'map-popup-container' });
          marker.addTo(map);
          markersRef.current.set(place.id, marker);
          bounds.push([Number(place.latitude), Number(place.longitude)]);
        }
      });
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [itinerary, itineraries]);

  const handleSelectItinerary = (val: string) => {
    window.history.pushState({}, '', val ? `/map?itinerary=${val}` : '/map');
    if (val) {
      getItinerary(Number(val)).then(setItinerary).catch(() => setError('Failed to load itinerary'));
    } else {
      setItinerary(null);
    }
    setSelectedPlaceId(null);
  };

  const handleSidebarPlaceClick = (place: Place) => {
    setSelectedPlaceId(place.id);
    const marker = markersRef.current.get(place.id);
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.setView(marker.getLatLng(), 14, { animate: true });
      marker.openPopup();
    }
  };

  const places: Place[] = itinerary
    ? itinerary.items.map((item) => item.place)
    : itineraries.flatMap((it) => it.items.map((item) => item.place));

  const uniquePlaces = Array.from(new Map(places.map((p) => [p.id, p])).values());

  const activeTitle = itinerary ? itinerary.title : 'All Saved Places';
  const activeSubtitle = itinerary
    ? (itinerary.description || `${itinerary.items.length} place${itinerary.items.length !== 1 ? 's' : ''} saved`)
    : `${uniquePlaces.length} place${uniquePlaces.length !== 1 ? 's' : ''} across all itineraries`;

  return (
    <div className="page map-page">
      {/* Page Header */}
      <div className="map-page-header">
        <div className="map-page-header-text">
          <h2 className="map-page-title">🗺️ {activeTitle}</h2>
          <p className="map-page-subtitle">Explore your saved places on the map</p>
        </div>
        {itineraries.length > 0 && (
          <div className="map-itinerary-select">
            <label htmlFor="map-itinerary-selector">Show itinerary:</label>
            <select
              id="map-itinerary-selector"
              value={itineraryId || ''}
              onChange={(e) => handleSelectItinerary(e.target.value)}
            >
              <option value="">All saved places</option>
              {itineraries.map((it) => (
                <option key={it.id} value={it.id}>{it.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <div className="error-banner" role="alert">{error}</div>}

      {/* Two-column layout */}
      <div className="map-layout">
        {/* Sidebar */}
        <aside className="map-sidebar">
          <div className="map-sidebar-section">
            <h3 className="map-sidebar-heading">📋 {activeTitle}</h3>
            <p className="map-sidebar-meta">{activeSubtitle}</p>
          </div>

          <div className="map-sidebar-section">
            <h4 className="map-sidebar-subheading">Saved Places</h4>
            {loading ? (
              <div className="map-loading" aria-label="Loading places">
                <span className="map-spinner" aria-hidden="true" />
                Loading places…
              </div>
            ) : uniquePlaces.length === 0 ? (
              <div className="map-empty-state">
                <div className="map-empty-icon">📍</div>
                <p className="map-empty-title">No places yet</p>
                <p className="map-empty-text">
                  Search for accessible places and add them to an itinerary to see them here.
                </p>
                <Link to="/places" className="btn-primary map-empty-cta">Find Places</Link>
              </div>
            ) : (
              <ul className="map-place-list">
                {uniquePlaces.map((place) => (
                  <li
                    key={place.id}
                    className={`map-place-item${selectedPlaceId === place.id ? ' map-place-item--active' : ''}`}
                    onClick={() => handleSidebarPlaceClick(place)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSidebarPlaceClick(place)}
                    aria-label={`Show ${place.name} on map`}
                  >
                    <span className="map-place-type-badge">{getTypeIcon(place.type)}</span>
                    <div className="map-place-info">
                      <span className="map-place-name">{place.name}</span>
                      <span className="map-place-location">📍 {place.city}, {place.country}</span>
                      {place.accessibility && (
                        <span className="map-place-a11y-tags">
                          {place.accessibility.wheelchairAccessible && <span className="map-a11y-dot" title="Wheelchair Accessible">♿</span>}
                          {place.accessibility.brailleMenu && <span className="map-a11y-dot" title="Braille Menu">⬛</span>}
                          {place.accessibility.accessibleRestroom && <span className="map-a11y-dot" title="Accessible Restroom">🚻</span>}
                          {place.accessibility.stepFreeEntry && <span className="map-a11y-dot" title="Step-Free Entry">🚪</span>}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {uniquePlaces.length > 0 && (
            <div className="map-sidebar-section map-legend-section">
              <h4 className="map-sidebar-subheading">Accessibility Legend</h4>
              <ul className="map-legend-list">
                <li><span>♿</span> Wheelchair Accessible</li>
                <li><span>⬛</span> Braille Menu</li>
                <li><span>🚻</span> Accessible Restroom</li>
                <li><span>🚪</span> Step-Free Entry</li>
              </ul>
            </div>
          )}

          <p className="map-hint">
            💡 Add places from the <Link to="/places">Search</Link> page.
          </p>
        </aside>

        {/* Map */}
        <div className="map-main">
          <div ref={mapRef} className="map-container" />
        </div>
      </div>
    </div>
  );
}
