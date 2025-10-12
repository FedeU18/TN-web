import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDetallePedidoCliente } from "../../../services/pedidosCliente";
import MonitorPedido from "../../../components/MonitorPedido/MonitorPedido";
import MapaRepartidor from "../../../components/MapaRepartidor/MapaRepartidor";
import styles from "./MisPedidosDetalle.module.css";

export default function MisPedidosDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const data = await getDetallePedidoCliente(id);
        setPedido(data);
      } catch (err) {
        setError("No se pudo obtener la información del pedido.");
        console.error(err);
      }
    };
    fetchPedido();
  }, [id]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!pedido) return <p className={styles.loading}>Cargando pedido...</p>;

  return (
    <div className={styles.detalleContainer}>
      <h1>Pedido</h1>

      {pedido.repartidor && (
        <p>
          <strong>Repartidor:</strong> {pedido.repartidor.nombre}{" "}
          {pedido.repartidor.apellido} ({pedido.repartidor.telefono})
        </p>
      )}

      {/*estado pedido*/}
      {pedido.estado === "En camino" && (
        <p className={styles.estado}>🚚 Repartidor en camino</p>
      )}

      <MonitorPedido pedidoId={id} />
      <br />

      {/*mapa*/}
      <div style={{ width: "100%", height: "350px", marginBottom: "20px" }}>
        <MapaRepartidor pedidoId={id} />
      </div>

      {/*boton de volver*/}
      <div>
        <Link to="/cliente-dashboard" className={styles.backLink}>
          &larr; Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}