import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/places">🌍 AccessTravel</Link>
      </div>
      <div className="navbar-links">
        <Link to="/places" className={location.pathname === '/places' ? 'active' : ''}>
          🔍 Places
        </Link>
        <Link to="/itineraries" className={location.pathname === '/itineraries' ? 'active' : ''}>
          🗺️ Itineraries
        </Link>
        <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>
          📍 Map
        </Link>
      </div>
      <div className="navbar-user">
        <span>👤 {user?.name}</span>
        <button onClick={handleLogout} className="btn-ghost">Logout</button>
      </div>
    </nav>
  );
}
