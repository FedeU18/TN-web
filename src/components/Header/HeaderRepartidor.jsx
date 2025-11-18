import { Link } from "react-router-dom";
import "./Header.css";

export default function HeaderRepartidor() {
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
      </nav>
    </header>
  );
}
