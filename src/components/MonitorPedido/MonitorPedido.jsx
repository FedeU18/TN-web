import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getDetallePedidoCliente } from "../../services/pedidosCliente";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./MonitorPedido.module.css";

export default function MonitorPedido({ pedidoId }) {
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);

  // Traer estado inicial del pedido
  useEffect(() => {
    const fetchEstado = async () => {
      try {
        const data = await getDetallePedidoCliente(pedidoId);
        setEstado(data.estado.nombre_estado || "Pendiente");
      } catch (err) {
        console.error("Error al obtener detalle del pedido:", err);
        setEstado("Pendiente");
      } finally {
        setLoading(false);
      }
    };
    fetchEstado();
  }, [pedidoId]);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
    );

    socket.emit("joinPedido", pedidoId);

    socket.on("estadoActualizado", (data) => {
      if (data.pedidoId === Number(pedidoId)) {
        setEstado(data.nuevoEstado);

        toast.info(`El pedido cambió de estado: ${data.nuevoEstado}`, {
          position: "top-center",
          autoClose: 4000,
        });
      }
    });

    return () => {
      socket.off("estadoActualizado");
      socket.emit("leavePedido", pedidoId);
      socket.disconnect();
    };
  }, [pedidoId]);

  if (loading) {
    return <p className={styles.loadingText}>Cargando estado del pedido...</p>;
  }

  // Mapear estado → clase
  const estadoToClass = {
    Pendiente: styles.pendiente,
    Asignado: styles.asignado,
    "En camino": styles.enCamino,
    Entregado: styles.entregado,
    Cancelado: styles.cancelado,
  };

  const colorClass = estadoToClass[estado] || styles.defaultColor;

  return (
    <div className={styles.container}>
      <ToastContainer />

      <div className={`${styles.estadoBadge} ${colorClass}`}>
        Estado: {estado}
      </div>
    </div>
  );
}
