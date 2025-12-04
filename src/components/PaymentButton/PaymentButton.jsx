import { useState } from "react";
import { SiMercadopago } from "react-icons/si";
import { crearPreferenciaPago } from "../../services/pagosService";
import styles from "./PaymentButton.module.css";

export default function PaymentButton({ id_pedido, estado_pago, estado_pedido, monto }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Solo mostrar botón si el pedido está en "No pagado"
  const mostrarBoton = estado_pedido === "No pagado";

  const handlePagar = async () => {
    if (!mostrarBoton) return;

    try {
      setLoading(true);
      setError("");

      // Crear preferencia en Mercado Pago
      const { init_point } = await crearPreferenciaPago(id_pedido);

      // Redirigir a Mercado Pago
      window.location.href = init_point;
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar pago");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mostrarBoton) {
    return null;
  }

  return (
    <div className={styles.paymentContainer}>
      {error && <p className={styles.error}>{error}</p>}

      <button
        onClick={handlePagar}
        disabled={loading}
        className={styles.button}
      >
        <SiMercadopago size={20} />
        {loading ? "Procesando..." : "Pagar con Mercado Pago"}
      </button>

      {monto && (
        <p className={styles.amount}>
          Monto a pagar: <strong>${parseFloat(monto).toFixed(2)}</strong>
        </p>
      )}
    </div>
  );
}
