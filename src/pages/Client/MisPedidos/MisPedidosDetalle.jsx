import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDetallePedidoCliente } from "../../../services/pedidosCliente";
import MonitorPedido from "../../../components/MonitorPedido/MonitorPedido";
import MapaRepartidor from "../../../components/MapaRepartidor/MapaRepartidor";
import io from "socket.io-client";
import styles from "./MisPedidosDetalle.module.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MisPedidosDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  const geocodeDireccion = async (direccion) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          direccion
        )}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const [lng, lat] = data.features[0]?.center || [];
      return { lat, lng };
    } catch (err) {
      console.error("Error al geocodificar dirección:", err);
      return { lat: null, lng: null };
    }
  };

  const fetchPedido = async () => {
    try {
      const data = await getDetallePedidoCliente(id);

      // 🚨 USAMOS SOLO LO QUE VIENE DEL BACKEND
      setPedido({
        ...data,
        origen_latitud: Number(data.origen_latitud),
        origen_longitud: Number(data.origen_longitud),
        destino_latitud: Number(data.destino_latitud),
        destino_longitud: Number(data.destino_longitud),
      });
    } catch (err) {
      setError("No se pudo obtener la información del pedido.");
      console.error(err);
    }
  };

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchPedido();
  }, [id]);

  // 🔹 Escuchar en tiempo real el cambio de estado
  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
    );

    socket.emit("joinPedido", id);

    socket.on("estadoActualizado", async (data) => {
      if (data.pedidoId === Number(id)) {
        // Si cambia a Asignado o En camino, recargamos los datos completos
        if (["Asignado", "En camino"].includes(data.nuevoEstado)) {
          await fetchPedido();
        }
      }
    });

    return () => {
      socket.off("estadoActualizado");
      socket.emit("leavePedido", id);
      socket.disconnect();
    };
  }, [id]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!pedido) return <p className={styles.loading}>Cargando pedido...</p>;
  console.log(pedido);
  return (
    <div className={styles.detalleContainer}>
      <div className={styles.detalleHeader}>
        <h1>Pedido #{pedido.id_pedido}</h1>

        {!pedido.repartidor ? (
          <div>
            <p className={styles.info}>
              Este pedido aún no fue asignado a un repartidor.
            </p>
            <p>Dirección de entrega: {pedido.direccion_destino} </p>
            <p>Fecha creación: {pedido.fecha_creacion}</p>
          </div>
        ) : (
          <div>
            <p className={styles.repartidor}>
              <strong>Repartidor:</strong> {pedido.repartidor.nombre}{" "}
              {pedido.repartidor.apellido}
            </p>
            <p>Dirección de entrega: {pedido.direccion_destino} </p>
            <p>Fecha creación: {pedido.fecha_creacion}</p>
          </div>
        )}

        <MonitorPedido pedidoId={id} />
      </div>

      {pedido.origen_latitud &&
      pedido.origen_longitud &&
      pedido.destino_latitud &&
      pedido.destino_longitud ? (
        <div className={styles.mapaWrapper}>
          <MapaRepartidor
            pedidoId={id}
            estadoPedido={pedido.estado?.nombre_estado}
            origen={{
              lat: pedido.origen_latitud,
              lng: pedido.origen_longitud,
            }}
            destino={{
              lat: pedido.destino_latitud,
              lng: pedido.destino_longitud,
            }}
          />
        </div>
      ) : (
        <p className={styles.loading}>
          Ubicaciones de origen/destino no disponibles.
        </p>
      )}
    </div>
  );
}
