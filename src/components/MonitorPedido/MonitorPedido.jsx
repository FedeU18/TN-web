import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getDetallePedidoCliente } from "../../services/pedidosCliente";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

        // 🟢 Notificación visual
        toast.info(`El pedido cambió de estado: ${data.nuevoEstado}`, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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
    return <p style={{ textAlign: "center" }}>Cargando estado del pedido...</p>;
  }

  const color =
    estado === "Pendiente"
      ? "gray"
      : estado === "Asignado"
      ? "orange"
      : estado === "En camino"
      ? "blue"
      : estado === "Entregado"
      ? "green"
      : estado === "Cancelado"
      ? "red"
      : "black";

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {/* Contenedor de notificaciones */}
      <ToastContainer />
      <h2>Estado del pedido</h2>
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
