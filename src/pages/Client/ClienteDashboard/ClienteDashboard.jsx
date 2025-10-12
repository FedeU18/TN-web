import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { getPedidosCliente } from "../../../services/pedidosCliente";
import styles from "./ClienteDashboard.module.css";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const PEDIDOS_PER_PAGE = 3;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosCliente();
        setPedidos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // Paginación
  const totalPages = Math.ceil(pedidos.length / PEDIDOS_PER_PAGE);
  const startIndex = (page - 1) * PEDIDOS_PER_PAGE;
  const paginatedPedidos = pedidos.slice(startIndex, startIndex + PEDIDOS_PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.title}>¡Bienvenido {user?.nombre || "Usuario"}!</h1>
        <p className={styles.greeting}>Dashboard del rol Cliente.</p>
        <p className={styles.subtitle}>Desde aquí podrás realizar y gestionar tus pedidos.</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton}>Hacer Pedido</button>
        <Link to="/profile" className={styles.secondaryButton}>Mi Perfil</Link>
      </div>

      <div className={styles.pedidosContainer}>
        <h2>Mis Pedidos</h2>
        {loading && <p>Cargando pedidos...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && paginatedPedidos.length === 0 && <p>No tienes pedidos aún.</p>}

        <ul className={styles.pedidosList}>
          {paginatedPedidos.map((pedido) => (
            <li key={pedido.id_pedido} className={styles.pedidoItem}>
              <span>
                Pedido — {pedido.estado?.nombre_estado || "Sin estado"}
              </span>
              <Link
                to={`/mis-pedidos/${pedido.id_pedido}`}
                className={styles.secondaryButton}
              >
                Ver Detalle
              </Link>
            </li>
          ))}
        </ul>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={page === num ? styles.activePage : ""}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
          </div>
        )}
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}