import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./CalificacionesRepartidor.module.css";
import { getCalificacionesDeRepartidor } from "../../../services/adminService";

export default function CalificacionesRepartidor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const repartidorNombre = location.state?.nombreCompleto || `Repartidor #${id}`;

  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalificaciones();
  }, []);

  const loadCalificaciones = async () => {
    try {
      const data = await getCalificacionesDeRepartidor(id);
      setCalificaciones(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loading}>Cargando calificaciones...</p>;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ⟵ Volver
      </button>

      <h1 className={styles.title}>Calificaciones de {repartidorNombre}</h1>

      {calificaciones.length === 0 ? (
        <p className={styles.empty}>Este repartidor no tiene calificaciones.</p>
      ) : (
        <div className={styles.list}>
          {calificaciones.map((c) => (
            <div key={c.id_calificacion} className={styles.card}>
              <p className={styles.score}>
                ⭐ <strong>{c.puntuacion}</strong> / 5
              </p>

              <p><strong>Comentario:</strong> {c.comentario || "Sin comentario"}</p>

              <p className={styles.fecha}>
                {new Date(c.fecha).toLocaleString()}
              </p>

              <p className={styles.cliente}>
                <strong>Cliente:</strong> {c.cliente.nombre} {c.cliente.apellido}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}