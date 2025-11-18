import { Link } from "react-router-dom";
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
        <Link to="/login">Ingresar</Link>
        <Link to="/register">Registrarse</Link>
      </nav>
    </header>
  );
}
