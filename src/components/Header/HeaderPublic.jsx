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

      <div className="hamburger" onClick={(e) => {
        const header = e.currentTarget.closest('.header');
        header.classList.toggle('menu-open');
      }}>
        ☰
      </div>

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
          onClick={(e) => e.currentTarget.closest('.header')?.classList.remove('menu-open')}
        >
          Ingresar
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? "active-link" : "")}
          onClick={(e) => e.currentTarget.closest('.header')?.classList.remove('menu-open')}
        >
          Registrarse
        </NavLink>
      </nav>
    </header>
  );
}
