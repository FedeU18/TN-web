import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../store/auth";

export default function HeaderVendedor() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };
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
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>
    </header>
  );
}
