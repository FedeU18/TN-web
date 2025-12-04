import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";

export default function HeaderAdmin() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
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

      <div className="hamburger" onClick={(e) => {
        const header = e.currentTarget.closest('.header');
        header.classList.toggle('menu-open');
      }}>
        ☰
      </div>

      <nav className="header-nav">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={(e) => e.currentTarget.closest('.header')?.classList.remove('menu-open')}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/admin-panel/pedidos"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Pedidos
        </NavLink>

        <NavLink
          to="/reports-panel"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Reportes
        </NavLink>

        <NavLink
          to="/admin-panel/usuarios"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Usuarios
        </NavLink>

        <NavLink
          to="/admin-panel/calificaciones"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Calificaciones
        </NavLink>

        <div className="profile-menu">
          <div 
            className="profile-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
            title={user?.nombre || "Perfil"}
          >
            {user?.nombre?.charAt(0).toUpperCase() || "A"}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">{user?.nombre || "Admin"}</div>
              <button 
                className="dropdown-item"
                onClick={(e) => { 
                  e.preventDefault();
                  setShowDropdown(false);
                  navigate("/perfil");
                }}
              >
                👤 Mi Perfil
              </button>
              <button 
                className="dropdown-item dropdown-logout"
                onClick={(e) => { 
                  e.preventDefault();
                  setShowDropdown(false);
                  handleLogout(); 
                }}
              >
                ✕ Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
