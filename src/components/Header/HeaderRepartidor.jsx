import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuthStore } from "../../store/auth";

export default function HeaderRepartidor() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); //limpia el token
    navigate("/"); //redirige al home
  };
  return (
    <header className="header">
      <h1>
        <Link to="/" className="header-logo">
          TrackNow
        </Link>
      </h1>

      <nav className="header-nav">
        <Link to="/repartidor-dashboard">Pedidos activos</Link>
        <Link to="/profile">Perfil</Link>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>
    </header>
  );
}
