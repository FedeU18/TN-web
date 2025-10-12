import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getDetallePedidoCliente } from "../services/pedidosCliente";

const socket = io("http://localhost:3000");

export default function MonitorPedido({ pedidoId }) {
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);

  //traer estado del pedido desde el backend
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

  //unirse a la sala del pedido y escuchar actualizaciones
  useEffect(() => {
    socket.emit("joinPedido", pedidoId);

    socket.on("estadoActualizado", (data) => {
      if (data.pedidoId === Number(pedidoId)) {
        setEstado(data.nuevoEstado);
      }
    });

    return () => {
      socket.off("estadoActualizado");
      socket.emit("leavePedido", pedidoId);
    };
  }, [pedidoId]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando estado del pedido...</p>;
  }

  //mostrar estado con colores
  const color =
    estado === "Pendiente"
      ? "gray"
      : estado === "Asignado"
      ? "orange"
      : estado === "En curso"
      ? "blue"
      : estado === "Entregado"
      ? "green"
      : "red";

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Estado del pedido #{pedidoId}</h2>
      <div
        style={{
          backgroundColor: color,
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        {estado}
      </div>
    </div>
  );
}