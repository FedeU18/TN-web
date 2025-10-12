import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidosCliente } from "../../../services/pedidosCliente";
import styles from "./MisPedidosList.module.css";

export default function MisPedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosCliente();
        setPedidos(data);
      } catch (err) {
        setError("No se pudieron cargar tus pedidos.");
        console.error(err);
      }
    };
    fetchPedidos();
  }, []);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (pedidos.length === 0) {
    return <p className={styles.empty}>No tienes pedidos aún.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis Pedidos</h1>
      <ul className={styles.list}>
        {pedidos.map((pedido) => (
          <li key={pedido.id_pedido} className={styles.item}>
            <div>
              <strong>Pedido #{pedido.id_pedido}</strong> —{" "}
              {pedido.estado?.nombre_estado || "Sin estado"}
              <br />
              {pedido.repartidor
                ? `Repartidor: ${pedido.repartidor.nombre} ${pedido.repartidor.apellido}`
                : "Aún no asignado"}
            </div>
            <Link
              to={`/mis-pedidos/${pedido.id_pedido}`}
              className={styles.link}
            >
              Ver detalle
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}