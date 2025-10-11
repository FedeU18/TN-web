import { useEffect, useState } from "react";
import { getPerformance } from "../../../services/reportApi";
import KpiCard from "../../../components/KpiCard/KpiCard";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend
} from "recharts";

export default function ReportsPanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repartidorId, setRepartidorId] = useState("");
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({ entregados: 0, cancelados: 0, tiempoPromedio: 0 });
  const [series, setSeries] = useState([]);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getPerformance({ startDate, endDate, repartidorId: repartidorId || undefined });
      //esperado: data.kpis, data.series, data.repartidores (opcional)
      setKpis(data.kpis ?? { entregados: 0, cancelados: 0, tiempoPromedio: 0 });
      setSeries(Array.isArray(data.series) ? data.series : []);
      if (Array.isArray(data.repartidores)) setRepartidores(data.repartidores);
      //si el endpoint no devuelve repartidores, mantener lista vacía o cargar desde otro endpoint
    } catch (e) {
      console.error(e);
      alert("No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []); //carga inicial

  const handleApply = () => fetch();

  return (
    <div style={{ padding: 16 }}>
      <h1>Reporte de desempeño</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <div>
          <label>Desde</label><br />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>Hasta</label><br />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Repartidor</label><br />
          <select value={repartidorId} onChange={e => setRepartidorId(e.target.value)}>
            <option value="">Todos</option>
            {repartidores.map(r => (
              <option key={r.id || r.id_usuario} value={r.id ?? r.id_usuario}>{r.nombre ?? r.nombre_completo ?? `#${r.id ?? r.id_usuario}`}</option>
            ))}
          </select>
        </div>

        <div style={{ marginLeft: 8 }}>
          <button onClick={handleApply} disabled={loading}>Aplicar</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KpiCard title="Pedidos entregados" value={kpis.entregados ?? 0} />
        <KpiCard title="Pedidos cancelados" value={kpis.cancelados ?? 0} />
        <KpiCard title="Tiempo promedio (min)" value={kpis.tiempoPromedio ?? 0} />
      </div>

      <div style={{ width: "100%", height: 360, background: "#fff", padding: 12, borderRadius: 8 }}>
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

      {series.length === 0 && !loading && <div style={{ marginTop: 12 }}>No hay datos para el rango seleccionado.</div>}
    </div>
  );
}