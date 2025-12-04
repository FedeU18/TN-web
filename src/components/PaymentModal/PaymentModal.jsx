import { useEffect, useState } from "react";
import styles from "./PaymentModal.module.css";

export default function PaymentModal({ status, onClose }) {
  const [isVisible, setIsVisible] = useState(!!status);

  useEffect(() => {
    if (status) {
      setIsVisible(true);
      // Auto-cerrar después de 4 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  if (!isVisible) return null;

  const getModalContent = () => {
    switch (status) {
      case "success":
        return {
          icon: "✓",
          title: "¡Pago Confirmado!",
          message: "Tu pago ha sido procesado exitosamente.",
          className: styles.success,
        };
      case "failure":
        return {
          icon: "✕",
          title: "Pago Rechazado",
          message: "El pago fue rechazado. Por favor, intenta nuevamente.",
          className: styles.failure,
        };
      case "pending":
        return {
          icon: "⏳",
          title: "Pago Pendiente",
          message: "Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.",
          className: styles.pending,
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${content.className}`}>
        <div className={styles.icon}>{content.icon}</div>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.message}>{content.message}</p>
        <button className={styles.closeBtn} onClick={() => setIsVisible(false)}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
