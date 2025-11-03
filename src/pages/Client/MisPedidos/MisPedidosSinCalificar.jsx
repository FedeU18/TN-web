import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidosSinCalificar } from "../../../services/pedidosCliente";
import styles from "./MisPedidosSinCalificar.module.css";

export default function MisPedidosSinCalificar() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosSinCalificar();
        setPedidos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pedidos sin calificar.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Pedidos sin calificar</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos pendientes de calificar.</p>
      ) : (
        <ul className={styles.pedidosList}>
          {pedidos.map((pedido) => (
            <li key={pedido.id_pedido} className={styles.pedidoItem}>
              <span>
                Pedido #{pedido.id_pedido} —{" "}
                {pedido.estado?.nombre_estado || "Sin estado"}
              </span>
              <Link
                to={`/calificar-repartidor/${pedido.id_pedido}`}
                className={styles.secondaryButton}
              >
                Calificar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
