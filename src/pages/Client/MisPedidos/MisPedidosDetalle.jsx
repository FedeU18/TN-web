import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { getDetallePedidoCliente } from "../../../services/pedidosCliente";
import MonitorPedido from "../../../components/MonitorPedido/MonitorPedido";
import MapaRepartidor from "../../../components/MapaRepartidor/MapaRepartidor";
import PaymentStatus from "../../../components/PaymentStatus/PaymentStatus";
import PaymentButton from "../../../components/PaymentButton/PaymentButton";
import PaymentModal from "../../../components/PaymentModal/PaymentModal";
import io from "socket.io-client";
import styles from "./MisPedidosDetalle.module.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MisPedidosDetalle() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

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

  const handleCloseModal = () => {
    setPaymentStatus(null);
    // Limpiar los parámetros de búsqueda de la URL
    navigate(location.pathname, { replace: true });
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
    
    // Mostrar modal si vuelve desde pago
    const paymentStatusParam = searchParams.get("payment");
    if (paymentStatusParam === "success") {
      setPaymentStatus("success");
      // Recargar datos después de 2 segundos para que el backend haya actualizado el estado
      const timer = setTimeout(() => {
        fetchPedido();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (paymentStatusParam === "failure") {
      setPaymentStatus("failure");
    } else if (paymentStatusParam === "pending") {
      setPaymentStatus("pending");
      // Recargar datos después de 2 segundos
      const timer = setTimeout(() => {
        fetchPedido();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Hacer polling cada 3 segundos para detectar cambios en el estado de pago
      const pollInterval = setInterval(async () => {
        try {
          const data = await getDetallePedidoCliente(id);
          // Si el estado de pago cambió a "pagado", actualizar la UI
          if (data.estado_pago === "pagado" && pedido?.estado_pago !== "pagado") {
            fetchPedido();
          }
        } catch (err) {
          // Ignorar errores de polling
        }
      }, 3000);
      return () => clearInterval(pollInterval);
    }
  }, [id, searchParams]);

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
  const formatearFecha = (isoString) => {
    const fecha = new Date(isoString);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = String(fecha.getFullYear()).slice(2);
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${año}, ${horas}:${minutos}`;
  };
  return (
    <>
      <PaymentModal 
        status={paymentStatus} 
        onClose={handleCloseModal} 
      />
      <div className={styles.detalleContainer}>
        <div className={styles.detalleHeader}>
          <h1>Pedido #{pedido.id_pedido}</h1>

          {/* Estado de Pago */}
          <PaymentStatus
            estado_pago={pedido.estado_pago}
            monto_pedido={pedido.monto_pedido}
            fecha_pago={pedido.fecha_pago}
          />

          {/* Botón de Pago */}
          <PaymentButton
            id_pedido={pedido.id_pedido}
            estado_pago={pedido.estado_pago}
            estado_pedido={pedido.estado?.nombre_estado}
            monto={pedido.monto_pedido}
          />

        {pedido.estado?.nombre_estado === "Pendiente" && !pedido.repartidor ? (
          <div>
            <p className={styles.info}>
              Este pedido aún no fue asignado a un repartidor.
            </p>
            <p className={styles.grayText}>Dirección de entrega: {pedido.direccion_destino} </p>
            <p className={styles.grayText}>Fecha de creación: {formatearFecha(pedido.fecha_creacion)}</p>
            {pedido.descripcion && <p className={styles.grayText}>Descripción del pedido: {pedido.descripcion}</p>}
          </div>
        ) : pedido.repartidor ? (
          <div>
            <p className={styles.repartidor}>
              <strong>Repartidor:</strong> {pedido.repartidor.nombre}{" "}
              {pedido.repartidor.apellido}
            </p>
            <p className={styles.grayText}>Dirección de entrega: {pedido.direccion_destino} </p>
            <p className={styles.grayText}>Fecha de creación: {formatearFecha(pedido.fecha_creacion)}</p>
            {pedido.descripcion && <p className={styles.grayText}>Descripción del pedido: {pedido.descripcion}</p>}
          </div>
        ) : (
          <div>
            <p className={styles.grayText}>Dirección de entrega: {pedido.direccion_destino} </p>
            <p className={styles.grayText}>Fecha de creación: {formatearFecha(pedido.fecha_creacion)}</p>
            {pedido.descripcion && <p className={styles.grayText}>Descripción del pedido: {pedido.descripcion}</p>}
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
    </>
  );
}
