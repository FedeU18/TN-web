import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../store/auth";
import { useState, useEffect, useRef } from "react";

export default function HeaderVendedor() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);
  
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

      <div className="hamburger" onClick={(e) => {
        const header = e.currentTarget.closest('.header');
        header.classList.toggle('menu-open');
      }}>
        ☰
      </div>

      <nav className="header-nav">
        <NavLink
          to="/vendedor-dashboard"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={(e) => e.currentTarget.closest('.header')?.classList.remove('menu-open')}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/crear-pedido"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={(e) => e.currentTarget.closest('.header')?.classList.remove('menu-open')}
        >
          Crear Pedido
        </NavLink>

        <div className="profile-menu" ref={dropdownRef}>
          <div 
            className="profile-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
            title={user?.nombre || "Perfil"}
          >
            {user?.nombre?.charAt(0).toUpperCase() || "V"}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">{user?.nombre || "Vendedor"}</div>
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
