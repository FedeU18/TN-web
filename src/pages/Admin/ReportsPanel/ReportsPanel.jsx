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
  Line,
  Legend
} from "recharts";

export default function ReportsPanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repartidorId, setRepartidorId] = useState("");
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({ entregados: 0, cancelados: 0, tiempoPromedio: 0 });
  const [series, setSeries] = useState([]);

  const hoy = new Date().toISOString().split("T")[0];

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getPerformance({
        startDate,
        endDate,
        repartidorId: repartidorId || undefined
      });

      //kpis
      setKpis(data.resumen ?? { entregados: 0, cancelados: 0, tiempoPromedio: 0 });

      //series para gráficos
     const seriesOrdenadas = Array.isArray(data.series)
        ? data.series
            .filter(s => {
              const fecha = new Date(s.fecha);
              const desde = startDate ? new Date(startDate) : null;
              const hasta = endDate ? new Date(endDate) : null;
              const dentroDelRango =
                (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
              const tienePedidos = s.entregados > 0 || s.cancelados > 0;
              return dentroDelRango && tienePedidos;
            })
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        : [];

      setSeries(seriesOrdenadas);

      //rpartidores
      if (Array.isArray(data.detalle_repartidores)) {
        const repartidoresFormateados = data.detalle_repartidores.map(r => ({
          id: r.id_repartidor,
          nombre: r.nombre
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reporte de Desempeño</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={hoy}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            max={hoy}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Repartidor</label>
          <select value={repartidorId} onChange={e => setRepartidorId(e.target.value)}>
            <option value="">Todos</option>
            {repartidores.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>
        <button className={styles.applyButton} onClick={handleApply} disabled={loading}>
          {loading ? "Cargando..." : "Aplicar"}
        </button>
      </div>

      <div className={styles.kpiContainer}>
        <KpiCard title="Pedidos entregados" value={kpis.entregados ?? 0} />
        <KpiCard title="Pedidos cancelados" value={kpis.cancelados ?? 0} />
        <KpiCard title="Tiempo promedio (min)" value={kpis.promedio_entrega_minutos ?? 0} />
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="entregados" fill="#4caf50" name="Entregados" />
            <Bar dataKey="cancelados" fill="#f44336" name="Cancelados" />
            <Line type="monotone" dataKey="tiempoPromedio" stroke="#2196f3" name="Tiempo promedio (min)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {series.length === 0 && !loading && (
        <div className={styles.noData}>No hay datos para el rango seleccionado.</div>
      )}

      <div className={styles.backLink}>
        <Link to="/admin-dashboard">← Volver al Dashboard</Link>
      </div>
    </div>
  );
}