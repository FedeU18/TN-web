import styles from "./PaymentStatus.module.css";

export default function PaymentStatus({ estado_pago, monto_pedido, fecha_pago }) {
  // Mapeo de estados a colores y mensajes
  const estadoMap = {
    pendiente: {
      label: "Pendiente de pago",
      color: "warning",
      descripcion: "El cliente aún no ha pagado este pedido",
    },
    pendiente_pago: {
      label: "Pago en proceso",
      color: "info",
      descripcion: "El pago está siendo procesado",
    },
    pagado: {
      label: "Pagado",
      color: "success",
      descripcion: "El pago fue confirmado",
    },
    fallido: {
      label: "Pago fallido",
      color: "danger",
      descripcion: "El pago fue rechazado, intenta nuevamente",
    },
    reembolsado: {
      label: "Reembolsado",
      color: "secondary",
      descripcion: "El pago fue reembolsado",
    },
  };

  const estado = estadoMap[estado_pago] || estadoMap.pendiente;

  return (
    <div className={`${styles.container} ${styles[estado.color]}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{estado.label}</h3>
      </div>

      <p className={styles.description}>{estado.descripcion}</p>

      {monto_pedido && (
        <div className={styles.monto}>
          <span>Monto:</span>
          <strong>${parseFloat(monto_pedido).toFixed(2)}</strong>
        </div>
      )}

      {fecha_pago && estado_pago === "pagado" && (
        <div className={styles.fecha}>
          <span>Pagado el:</span>
          <strong>{new Date(fecha_pago).toLocaleDateString("es-AR")}</strong>
        </div>
      )}
    </div>
  );
}
