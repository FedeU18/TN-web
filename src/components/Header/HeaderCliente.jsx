import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";

export default function HeaderCliente() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };
  return (
    <header className="header">
      <h1>
        <Link to="/cliente-dashboard" className="header-logo">
          TrackNow
        </Link>
      </h1>

      <nav className="header-nav">
        <NavLink
          to="/cliente-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/mis-pedidos"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Mis pedidos
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
