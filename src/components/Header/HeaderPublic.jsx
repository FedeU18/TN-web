import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function HeaderPublic() {
  return (
    <header className="header">
      <h1>
        <Link to="/" className="header-logo">
          TrackNow
        </Link>
      </h1>

      <nav className="header-nav">
        {/* <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Perfil
        </NavLink> */}
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Ingresar
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Registrarse
        </NavLink>
      </nav>
    </header>
  );
}
