import React, { useState, useEffect, useRef } from 'react';
import { getItineraries, createItinerary, deleteItinerary } from '../api';
import type { Itinerary } from '../types';
import { Link } from 'react-router-dom';

/** Format a YYYY-MM-DD string as "Jan 15, 2024" without timezone shift. */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ItineraryPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [creating, setCreating] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchItineraries();
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccess(''), 4000);
  };

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
      showSuccess('Itinerary created successfully!');
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
      showSuccess(`"${title}" deleted.`);
    } catch {
      setError('Failed to delete itinerary.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>🗺️ My Itineraries</h2>
          <p className="itinerary-page-subtitle">Manage your saved travel plans and places</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕ Cancel' : '+ New Itinerary'}
        </button>
      </div>

      {success && <div className="success-banner" role="status">{success}</div>}
      {error && <div className="error-banner" role="alert">{error}</div>}

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
        <div className="itinerary-loading">
          <span className="itinerary-spinner" />
          Loading itineraries…
        </div>
      ) : itineraries.length === 0 ? (
        <div className="itinerary-empty-state">
          <div className="itinerary-empty-icon">🗺️</div>
          <h3>No itineraries yet</h3>
          <p>Create your first travel plan and start adding places to explore.</p>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            + Create First Itinerary
          </button>
        </div>
      ) : (
        <div className="itinerary-list">
          {itineraries.map((it) => (
            <div key={it.id} className="itinerary-card">
              <div className="itinerary-header">
                <div className="itinerary-card-info">
                  <div className="itinerary-title-row">
                    <h3>{it.title}</h3>
                    <span className="itinerary-place-count-badge">
                      {it.items.length} {it.items.length !== 1 ? 'places' : 'place'}
                    </span>
                  </div>
                  {it.description && <p className="itinerary-description">{it.description}</p>}
                  {(it.startDate || it.endDate) && (
                    <p className="itinerary-dates">
                      📅 {it.startDate ? formatDate(it.startDate) : '—'} → {it.endDate ? formatDate(it.endDate) : '—'}
                    </p>
                  )}
                  <p className="itinerary-meta">
                    Created {new Date(it.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="itinerary-actions">
                  <Link to={`/map?itinerary=${it.id}`} className="btn-secondary">🗺️ View Map</Link>
                  <button className="btn-danger" onClick={() => handleDelete(it.id, it.title)}>Delete</button>
                </div>
              </div>

              {it.items.length > 0 && (
                <div className="itinerary-places">
                  <p className="itinerary-places-label">Saved places</p>
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
