import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function HeaderVendedor() {
  return (
    <header className="header">
      <h1>
        <Link to="/vendedor-dashboard" className="header-logo">
          TrackNow
        </Link>
      </h1>

      <nav className="header-nav">
        <NavLink
          to="/vendedor-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Nuevo Pedido
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
