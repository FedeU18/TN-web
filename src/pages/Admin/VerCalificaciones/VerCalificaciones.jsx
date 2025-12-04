import { useEffect, useState } from "react";
import styles from "./VerCalificaciones.module.css";
import { getRepartidoresConCalificaciones } from "../../../services/adminService";
import { Link } from "react-router-dom";

export default function VerCalificaciones() {
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("promedio"); // "promedio" o "total"

  useEffect(() => {
    fetchCalificaciones();
  }, []);

  const fetchCalificaciones = async () => {
    try {
      const data = await getRepartidoresConCalificaciones();
      setRepartidores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedRepartidores = () => {
    const sorted = [...repartidores];
    if (sortBy === "promedio") {
      return sorted.sort((a, b) => parseFloat(b.promedio_calificacion) - parseFloat(a.promedio_calificacion));
    } else {
      return sorted.sort((a, b) => b.total_calificaciones - a.total_calificaciones);
    }
  };

  const getStarRating = (promedio) => {
    const stars = Math.round(parseFloat(promedio) || 0);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  if (loading) return <p className={styles.loading}>Cargando calificaciones...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Calificaciones de Repartidores</h1>
        <p className={styles.subtitle}>(Hacé click en el nombre del repartidor para ver el detalle de sus calificaciones)</p>
      </div>

      <div className={styles.filterContainer}>
        <label>Ordenar por:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.filterSelect}>
          <option value="promedio">Promedio (Mayor a Menor)</option>
          <option value="total">Total de Calificaciones</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Repartidor</th>
              <th>Promedio</th>
              <th>Calificación</th>
              <th>Total Calificaciones</th>
            </tr>
          </thead>

          <tbody>
            {sortedRepartidores().map((r) => (
              <tr key={r.id_usuario}>
                <td>{r.id_usuario}</td>
                <td className={styles.name}>
                  <Link to={`/admin/repartidor/${r.id_usuario}/calificaciones`} className={styles.link}>
                    {r.nombre} {r.apellido}
                  </Link>
                </td>
                <td className={styles.promedio}>{r.promedio_calificacion}</td>
                <td className={styles.stars}>{getStarRating(r.promedio_calificacion)}</td>
                <td className={styles.total}>{r.total_calificaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}