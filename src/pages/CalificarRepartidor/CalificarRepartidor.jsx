import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { calificarRepartidor } from "../../services/repartidoresApi";
import { FaStar } from "react-icons/fa";
import styles from "./CalificarRepartidor.module.css";

export default function CalificarRepartidor() {
  const { id } = useParams(); // ID del pedido
  const navigate = useNavigate(); // ← para redirigir
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setMensaje("Por favor selecciona una calificación antes de enviar.");
      return;
    }

    try {
      setEnviando(true);
      await calificarRepartidor({
        id_pedido: id,
        puntuacion: rating,
        comentario,
      });
      setMensaje("¡Calificación enviada con éxito! 😊");

      // Espera un momento para mostrar el mensaje y luego redirige
      setTimeout(() => {
        navigate("/cliente-dashboard"); // ← redirige al dashboard
      }, 1500);
    } catch (error) {
      console.error(error);
      setMensaje("Error al enviar la calificación. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Calificar repartidor del pedido #{id}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={40}
              className={styles.star}
              color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </div>

        <label htmlFor="comentario">Comentario (opcional):</label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="¿Qué te pareció el servicio del repartidor?"
          className={styles.textarea}
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar Calificación"}
        </button>
      </form>

      {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
    </div>
  );
}
