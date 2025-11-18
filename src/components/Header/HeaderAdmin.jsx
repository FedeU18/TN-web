import { NavLink, Link } from "react-router-dom";
import "./Header.css";

export default function HeaderAdmin() {
  return (
    <header className="header">
      <h1>
        <Link to="/admin-dashboard" className="header-logo">
          TrackNow
        </Link>
      </h1>

      <nav className="header-nav">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin-panel"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Panel
        </NavLink>

        <NavLink
          to="/reports-panel"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Reportes
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Perfil
        </NavLink>
      </nav>
    </header>
  );
}
