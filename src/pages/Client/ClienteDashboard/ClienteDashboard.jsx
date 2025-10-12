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

  const handleLogout = () => {
    logout();        // limpia el token
    navigate("/");   // redirige al home
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

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.title}>¡Bienvenido {user?.nombre || "Usuario"}!</h1>
        <p className={styles.greeting}>Dashboard del rol Cliente.</p>
        <p className={styles.subtitle}>Desde aquí podrás realizar y gestionar tus pedidos.</p>
      </div>

      <div className={styles.buttonContainer}> 
        <button className={styles.primaryButton}>
          Hacer Pedido
        </button>

        <Link to="/profile" className={styles.secondaryButton}>
          Mi Perfil
        </Link>
      </div>

      <div className={styles.pedidosContainer}>
        <h2>Mis Pedidos</h2>

        {loading && <p>Cargando pedidos...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && pedidos.length === 0 && <p>No tienes pedidos aún.</p>}

        <ul className={styles.pedidosList}>
          {pedidos.map((pedido) => (
            <li key={pedido.id_pedido} className={styles.pedidoItem}>
              <span>
                Pedido #{pedido.id_pedido} — {pedido.estado?.nombre_estado || "Sin estado"}
              </span>
              <Link
                to={`/mis-pedidos/${pedido.id_pedido}`}
                className={styles.secondaryButton}
              >
                Ver Detalle / Monitorear
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}