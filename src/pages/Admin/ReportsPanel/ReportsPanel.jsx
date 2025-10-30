import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPerformance } from "../../../services/reportApi";
import KpiCard from "../../../components/KpiCard/KpiCard";
import styles from "./ReportsPanel.module.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function ReportsPanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repartidorId, setRepartidorId] = useState("");
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({
    entregados: 0,
    cancelados: 0,
    tiempoPromedio: 0,
    promedio_calificacion_general: 0,
  });
  const [series, setSeries] = useState([]);

  const hoy = new Date().toISOString().split("T")[0];

  const fetch = async ({ startDate: sd, endDate: ed, repartidorId: rid } = {}) => {
    setLoading(true);
    // usar parámetros si vienen, si no usar state
    const sDate = sd !== undefined ? sd : startDate;
    const eDate = ed !== undefined ? ed : endDate;
    const rId = rid !== undefined ? rid : repartidorId;

    try {
      const data = await getPerformance({
        startDate: sDate || undefined,
        endDate: eDate || undefined,
        repartidorId: rId || undefined,
      });

      setKpis(
        data.resumen ?? {
          entregados: 0,
          cancelados: 0,
          tiempoPromedio: 0,
          promedio_calificacion_general: 0,
        }
      );

      const seriesOrdenadas = Array.isArray(data.series)
        ? data.series
            .filter((s) => {
              const fecha = new Date(s.fecha);
              const desde = sDate ? new Date(sDate) : null;
              const hasta = eDate ? new Date(eDate) : null;
              const dentroDelRango =
                (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
              const tienePedidos = s.entregados > 0 || s.cancelados > 0;
              return dentroDelRango && tienePedidos;
            })
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        : [];

      setSeries(seriesOrdenadas);

      if (Array.isArray(data.detalle_repartidores)) {
        const repartidoresFormateados = data.detalle_repartidores.map((r) => ({
          id: r.id_repartidor,
          nombre: r.nombre,
        }));
        setRepartidores(repartidoresFormateados);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleApply = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }
    fetch();
  };

  const handleClearFilters = () => {
    // actualizar state y llamar fetch pasando explícitamente valores vacíos
    setStartDate("");
    setEndDate("");
    setRepartidorId("");
    fetch({ startDate: "", endDate: "", repartidorId: "" });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reporte de Desempeño</h1>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={hoy}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={hoy}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Repartidor</label>
          <select
            value={repartidorId}
            onChange={(e) => setRepartidorId(e.target.value)}
          >
            <option value="">Todos</option>
            {repartidores.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          className={styles.applyButton}
          onClick={handleApply}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Aplicar"}
        </button>
        {/*limpiar filtros*/}
        <button
          className={styles.clearButton}
          onClick={handleClearFilters}
          disabled={loading}
        >
          Limpiar
        </button>
      </div>

      {/*KPI Cards*/}
      <div className={styles.kpiContainer}>
        <KpiCard title="Pedidos entregados" value={kpis.entregados ?? 0} />
        <KpiCard title="Pedidos cancelados" value={kpis.cancelados ?? 0} />
        <KpiCard
          title="Tiempo promedio (min)"
          value={kpis.promedio_entrega_minutos ?? 0}
        />
        <KpiCard
          title="Promedio calificación general"
          value={kpis.promedio_calificacion_general ?? 0}
        />
      </div>

      <div className={styles.chartGrid}>
        {/* GRÁFICO 1 */}
        <div className={styles.chartSection}>
          <h2>Productividad (Pedidos entregados vs cancelados)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entregados" fill="#4caf50" name="Entregados" />
              <Bar dataKey="cancelados" fill="#f44336" name="Cancelados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO 2 */}
        <div className={styles.chartSection}>
          <h2>Eficiencia (Tiempo promedio de entrega)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tiempoPromedio"
                stroke="#2196f3"
                name="Tiempo promedio (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO 3 */}
        <div className={`${styles.chartSection} ${styles.chartFull}`}>
          <h2>Satisfacción (Promedio de calificación)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="promedioCalificacion"
                stroke="#ff9800"
                name="Promedio calificación"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {series.length === 0 && !loading && (
        <div className={styles.noData}>
          No hay datos para el rango seleccionado.
        </div>
      )}

      <div className={styles.backLink}>
        <Link to="/admin-dashboard">← Volver al Dashboard</Link>
      </div>
    </div>
  );
}