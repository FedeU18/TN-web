import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeaderCliente() {
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
        <Link to="/cliente-dashboard" className="header-logo">
          TrackNow
        </Link>
      </h1>

      <div
        className="hamburger"
        onClick={(e) => {
          const header = e.currentTarget.closest(".header");
          header.classList.toggle("menu-open");
        }}
      >
        ☰
      </div>

      <nav className="header-nav">
        <NavLink
          to="/cliente-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={(e) =>
            e.currentTarget.closest(".header")?.classList.remove("menu-open")
          }
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

        <div className="profile-menu">
          <div 
            className="profile-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
            title={user?.nombre || "Perfil"}
          >
            {user?.nombre?.charAt(0).toUpperCase() || "C"}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">{user?.nombre || "Cliente"}</div>
              <button 
                className="dropdown-item"
                onClick={(e) => { 
                  e.preventDefault();
                  setShowDropdown(false);
                  navigate("/profile");
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
