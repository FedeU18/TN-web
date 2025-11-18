import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../hooks/useAuthStore";

export default function HeaderAdmin() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };
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
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>
    </header>
  );
}
