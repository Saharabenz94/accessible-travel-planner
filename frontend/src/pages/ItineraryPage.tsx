import React, { useState, useEffect } from 'react';
import { getItineraries, createItinerary, deleteItinerary } from '../api';
import type { Itinerary } from '../types';
import { Link } from 'react-router-dom';

export default function ItineraryPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch {
      setError('Failed to load itineraries.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await createItinerary({
        title: form.title,
        description: form.description || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      setForm({ title: '', description: '', startDate: '', endDate: '' });
      setShowCreate(false);
      await fetchItineraries();
    } catch {
      setError('Failed to create itinerary.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete itinerary "${title}"?`)) return;
    try {
      await deleteItinerary(id);
      setItineraries((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setError('Failed to delete itinerary.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>🗺️ My Itineraries</h2>
        <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : '+ New Itinerary'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showCreate && (
        <div className="create-form-card">
          <h3>Create New Itinerary</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="My European Adventure"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description..."
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Itinerary'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading itineraries...</div>
      ) : itineraries.length === 0 ? (
        <div className="empty-state">
          <p>No itineraries yet. Create one or add places from the <Link to="/places">Places</Link> page.</p>
        </div>
      ) : (
        <div className="itinerary-list">
          {itineraries.map((it) => (
            <div key={it.id} className="itinerary-card">
              <div className="itinerary-header">
                <div>
                  <h3>{it.title}</h3>
                  {it.description && <p className="itinerary-description">{it.description}</p>}
                  {(it.startDate || it.endDate) && (
                    <p className="itinerary-dates">
                      📅 {it.startDate || '—'} → {it.endDate || '—'}
                    </p>
                  )}
                  <p className="itinerary-meta">{it.items.length} place{it.items.length !== 1 ? 's' : ''} · Created {new Date(it.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="itinerary-actions">
                  <Link to={`/map?itinerary=${it.id}`} className="btn-secondary">🗺️ View Map</Link>
                  <button className="btn-danger" onClick={() => handleDelete(it.id, it.title)}>Delete</button>
                </div>
              </div>

              {it.items.length > 0 && (
                <div className="itinerary-places">
                  {it.items.map((item) => (
                    <div key={item.id} className="itinerary-place-item">
                      <span className="place-icon">{item.place.type === 'hotel' ? '🏨' : '🍽️'}</span>
                      <div>
                        <strong>{item.place.name}</strong>
                        <span className="place-city"> — {item.place.city}</span>
                        {item.dayNumber && <span className="day-badge">Day {item.dayNumber}</span>}
                        {item.notes && <p className="item-notes">{item.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
