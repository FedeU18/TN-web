// src/components/MonitorPedido.jsx
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // tu backend

export default function MonitorPedido({ pedidoId }) {
  const [estado, setEstado] = useState("Pendiente");

  useEffect(() => {
    //conectarse a la sala del pedido
    socket.emit("joinPedido", pedidoId);

    //escuchar actualizaciones del pedido
    socket.on("estadoActualizado", (data) => {
      if (data.pedidoId === pedidoId) {
        setEstado(data.nuevoEstado);
      }
    });

    //limpiar al desmontar
    return () => {
      socket.off("estadoActualizado");
      socket.emit("leavePedido", pedidoId);
    };
  }, [pedidoId]);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Estado del pedido #{pedidoId}</h2>
      <div
        style={{
          backgroundColor:
            estado === "Pendiente"
              ? "gray"
              : estado === "Asignado"
              ? "orange"
              : estado === "En curso"
              ? "blue"
              : estado === "Entregado"
              ? "green"
              : "red",
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