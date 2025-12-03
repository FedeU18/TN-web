import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidosCliente } from "../../../services/pedidosCliente";
import styles from "./MisPedidosList.module.css";

export default function MisPedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ← agregado

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosCliente();
        setPedidos(data);
      } catch (err) {
        setError("No se pudieron cargar tus pedidos.");
        console.error(err);
      } finally {
        setLoading(false); // ← cuando termine todo
      }
    };
    fetchPedidos();
  }, []);

  // ---- LOADING ----
  if (loading) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  // ---- ERROR ----
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // ---- SIN PEDIDOS ----
  if (pedidos.length === 0) {
    return <p className={styles.empty}>No tienes pedidos aún.</p>;
  }

  // ---- FORMATEO FECHA ----
  const formatearFecha = (isoString) => {
    const fecha = new Date(isoString);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = String(fecha.getFullYear()).slice(2);
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${año}, ${horas}:${minutos}`;
  };

  const estadoClass = {
    "No pagado": styles.estadoNoPagado,
    Pendiente: styles.estadoPendiente,
    Asignado: styles.estadoAsignado,
    "En camino": styles.estadoEnCurso,
    Entregado: styles.estadoEntregado,
    Cancelado: styles.estadoCancelado,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis Pedidos</h1>
      <ul className={styles.list}>
        {pedidos.map((pedido) => (
          <li key={pedido.id_pedido} className={styles.item}>
            <div className={styles.firstColumn}>
              <h3>Pedido #{pedido.id_pedido}</h3>
              <p className={styles.repartidor}>
                {pedido.repartidor
                  ? `Repartidor: ${pedido.repartidor.nombre} ${pedido.repartidor.apellido}`
                  : "Aún no asignado"}
              </p>
              <p>Destino: {pedido.direccion_destino}</p>
              <p className={styles.fecha}>
                Creado: {formatearFecha(pedido.fecha_creacion)}
              </p>
            </div>

            <div className={styles.secondColumn}>
              <p
                className={`${estadoClass[pedido.estado?.nombre_estado]} ${
                  styles.estado
                }`}
              >
                {pedido.estado?.nombre_estado === "No pagado" ? "No pagado" : pedido.estado?.nombre_estado || "Sin estado"}
              </p>

              <Link
                to={`/mis-pedidos/${pedido.id_pedido}`}
                className={styles.link}
              >
                Tocá para ver detalles →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
