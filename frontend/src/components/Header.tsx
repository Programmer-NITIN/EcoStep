import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="site-logo">EcoStep</NavLink>
          <nav className="site-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
            <NavLink to="/tracker" className={({ isActive }) => isActive ? "active" : ""}>Tracker</NavLink>
            <NavLink to="/community" className={({ isActive }) => isActive ? "active" : ""}>Community</NavLink>
            <NavLink to="/resources" className={({ isActive }) => isActive ? "active" : ""}>Resources</NavLink>
          </nav>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Account">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
