import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllPedidosAdmin } from "../../../services/pedidosAdmin";;
import MonitorPedido from "../../../components/MonitorPedido/MonitorPedido";
import MapaRepartidor from "../../../components/MapaRepartidor/MapaRepartidor";
import styles from "./PedidoAdminDetalle.module.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PedidoAdminDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  const geocodeDireccion = async (direccion) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const [lng, lat] = data.features[0]?.center || [];
      return { lat, lng };
    } catch (err) {
      console.error("Error al geocodificar dirección:", err);
      return { lat: null, lng: null };
    }
  };

    useEffect(() => {
    const fetchPedido = async () => {
        try {
        const pedidos = await getAllPedidosAdmin();
        const pedidoEncontrado = pedidos.find((p) => p.id_pedido === Number(id));

        if (!pedidoEncontrado) {
            setError("Pedido no encontrado.");
            return;
        }

        const origenCoords = await geocodeDireccion(pedidoEncontrado.direccion_origen);
        const destinoCoords = await geocodeDireccion(pedidoEncontrado.direccion_destino);

        setPedido({
            ...pedidoEncontrado,
            origen_latitud: origenCoords.lat,
            origen_longitud: origenCoords.lng,
            destino_latitud: destinoCoords.lat,
            destino_longitud: destinoCoords.lng,
        });
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
      <h1>Detalle del Pedido #{pedido.id_pedido}</h1>

      <p><strong>Cliente:</strong> {pedido.cliente?.nombre} {pedido.cliente?.apellido}</p>

      {!pedido.repartidor && (
        <p className={styles.info}>Este pedido aún no fue asignado a un repartidor.</p>
      )}

      {pedido.repartidor && (
        <p>
          <strong>Repartidor:</strong> {pedido.repartidor.nombre}{" "}
          {pedido.repartidor.apellido} ({pedido.repartidor.telefono})
        </p>
      )}

      <MonitorPedido pedidoId={id} />
      <br />

      {pedido.origen_latitud && pedido.origen_longitud &&
       pedido.destino_latitud && pedido.destino_longitud ? (
        <div className={styles.mapWrapper}>
          <MapaRepartidor
            pedidoId={id}
            origen={{ lat: pedido.origen_latitud, lng: pedido.origen_longitud }}
            destino={{ lat: pedido.destino_latitud, lng: pedido.destino_longitud }}
          />
        </div>
      ) : (
        <p className={styles.loading}>Ubicaciones de origen/destino no disponibles.</p>
      )}

      <div>
        <Link to="/admin-panel/pedidos" className={styles.backLink}>
          &larr; Volver a todos los pedidos
        </Link>
      </div>
    </div>
  );
}