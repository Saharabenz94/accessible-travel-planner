import React, { useState, useEffect } from 'react';
import { searchPlaces, getItineraries, addItineraryItem, createItinerary } from '../api';
import type { Place, Itinerary } from '../types';

const ACCESSIBILITY_FILTERS = [
  { key: 'wheelchairAccessible', label: '♿ Wheelchair Accessible' },
  { key: 'brailleMenu', label: '⬛ Braille Menu' },
  { key: 'accessibleRestroom', label: '🚻 Accessible Restroom' },
  { key: 'stepFreeEntry', label: '🚪 Step-Free Entry' },
] as const;

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filters, setFilters] = useState({
    type: '',
    city: '',
    wheelchairAccessible: false,
    brailleMenu: false,
    accessibleRestroom: false,
    stepFreeEntry: false,
  });

  const [addModal, setAddModal] = useState<{ place: Place; itineraryId: string } | null>(null);
  const [newItineraryTitle, setNewItineraryTitle] = useState('');
  const [showNewItinerary, setShowNewItinerary] = useState(false);

  useEffect(() => {
    fetchItineraries();
    handleSearch();
  }, []);

  const fetchItineraries = async () => {
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch {
      // silently fail
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = {};
      if (filters.type) params.type = filters.type;
      if (filters.city) params.city = filters.city;
      if (filters.wheelchairAccessible) params.wheelchairAccessible = true;
      if (filters.brailleMenu) params.brailleMenu = true;
      if (filters.accessibleRestroom) params.accessibleRestroom = true;
      if (filters.stepFreeEntry) params.stepFreeEntry = true;
      const data = await searchPlaces(params);
      setPlaces(data);
    } catch {
      setError('Failed to load places. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToItinerary = async () => {
    if (!addModal) return;
    setError('');
    setSuccess('');
    try {
      let itineraryId = Number(addModal.itineraryId);
      if (addModal.itineraryId === '__new__') {
        if (!newItineraryTitle.trim()) {
          setError('Please enter a title for the new itinerary');
          return;
        }
        const created = await createItinerary({ title: newItineraryTitle });
        itineraryId = created.id;
        setNewItineraryTitle('');
        setShowNewItinerary(false);
        await fetchItineraries();
      }
      await addItineraryItem(itineraryId, { placeId: addModal.place.id });
      setSuccess(`"${addModal.place.name}" added to itinerary!`);
      setAddModal(null);
    } catch {
      setError('Failed to add place to itinerary.');
    }
  };

  const AccessibilityBadge = ({ place }: { place: Place }) => (
    <div className="accessibility-badges">
      {place.accessibility?.wheelchairAccessible && <span className="badge badge-green">♿ Wheelchair</span>}
      {place.accessibility?.brailleMenu && <span className="badge badge-blue">⬛ Braille Menu</span>}
      {place.accessibility?.accessibleRestroom && <span className="badge badge-purple">🚻 Restroom</span>}
      {place.accessibility?.stepFreeEntry && <span className="badge badge-orange">🚪 Step-Free</span>}
    </div>
  );

  return (
    <div className="page">
      <h2>🔍 Search Accessible Places</h2>

      {success && <div className="success-banner">{success}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-row">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="select-input"
          >
            <option value="">All Types</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
          </select>
          <input
            type="text"
            placeholder="City (e.g. Paris)"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="text-input"
          />
          <button type="submit" className="btn-primary">Search</button>
        </div>

        <div className="filter-checkboxes">
          {ACCESSIBILITY_FILTERS.map(({ key, label }) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
        </div>
      </form>

      {loading ? (
        <div className="loading">Loading places...</div>
      ) : (
        <div className="places-grid">
          {places.length === 0 ? (
            <p className="no-results">No places found. Try adjusting your filters.</p>
          ) : (
            places.map((place) => (
              <div key={place.id} className="place-card">
                <div className="place-header">
                  <span className="place-type-badge">{place.type === 'hotel' ? '🏨' : '🍽️'} {place.type}</span>
                  <h3>{place.name}</h3>
                </div>
                <p className="place-address">📍 {place.address}, {place.city}, {place.country}</p>
                {place.description && <p className="place-description">{place.description}</p>}
                <AccessibilityBadge place={place} />
                <button
                  className="btn-secondary"
                  onClick={() => setAddModal({ place, itineraryId: itineraries[0]?.id?.toString() || '__new__' })}
                >
                  + Add to Itinerary
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add to Itinerary Modal */}
      {addModal && (
        <div className="modal-overlay" onClick={() => setAddModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add "{addModal.place.name}" to Itinerary</h3>
            <div className="form-group">
              <label>Select Itinerary</label>
              <select
                value={addModal.itineraryId}
                onChange={(e) => {
                  setAddModal({ ...addModal, itineraryId: e.target.value });
                  setShowNewItinerary(e.target.value === '__new__');
                }}
              >
                {itineraries.map((it) => (
                  <option key={it.id} value={it.id}>{it.title}</option>
                ))}
                <option value="__new__">+ Create New Itinerary</option>
              </select>
            </div>
            {(showNewItinerary || itineraries.length === 0) && (
              <div className="form-group">
                <label>New Itinerary Title</label>
                <input
                  type="text"
                  value={newItineraryTitle}
                  onChange={(e) => setNewItineraryTitle(e.target.value)}
                  placeholder="My Trip to Paris"
                />
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddToItinerary}>Add</button>
              <button className="btn-ghost" onClick={() => setAddModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
