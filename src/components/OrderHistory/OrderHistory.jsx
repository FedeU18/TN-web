import { useEffect, useState } from "react";
import axios from "../../libs/axios";
import { useAuthStore } from "../../store/auth";
import styles from "./OrderHistory.module.css";

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || "";
  if (statusLower.includes("entregado")) return "#10b981";
  if (statusLower.includes("cancelado")) return "#ef4444";
  if (statusLower.includes("en camino")) return "#f97316";
  if (statusLower.includes("pendiente")) return "#fbbf24";
  if (statusLower.includes("asignado")) return "#3b82f6";
  if (statusLower.includes("no pagado")) return "#f97316";
  return "#6b7280"; 
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { user } = useAuthStore();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let rawOrders = [];
      
      // Detectar rol y usar endpoint correspondiente
      if (user?.rol === "vendedor") {
        const res = await axios.get("/vendedor/mis-pedidos");
        rawOrders = res.data.pedidos || [];
        // Normalizar datos del vendedor
        rawOrders = rawOrders.map(o => ({
          id_pedido: o.id_pedido,
          fecha: o.fecha_creacion,
          direccion: o.direccion_destino,
          estado: o.estado?.nombre_estado || "Desconocido"
        }));
      } else if (user?.rol === "repartidor") {
        const res = await axios.get("/repartidor/mis-entregas");
        rawOrders = res.data.entregas || [];
        // Normalizar datos del repartidor
        rawOrders = rawOrders.map(o => ({
          id_pedido: o.id_pedido,
          fecha: o.fecha_entrega || o.fecha_creacion,
          direccion: o.direccion_destino,
          estado: o.estado?.nombre_estado || "Desconocido"
        }));
      } else {
        // Cliente
        const res = await axios.get("/users/me/orders");
        rawOrders = res.data || [];
      }
      
      setOrders(rawOrders);
    } catch (e) {
      console.error(e);
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.rol]);

  if (loading) return <div className={styles.loading}>⏳ Cargando pedidos...</div>;
  if (error) return <div className={styles.error}>⚠️ {error}</div>;
  if (orders.length === 0) return <div className={styles.noPedidos}>No hay pedidos registrados</div>;

  // -------------------------
  // FILTRADO DE PEDIDOS
  // -------------------------
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.fecha);

    // Filtrar por fecha "Desde"
    if (dateFrom && orderDate < new Date(dateFrom)) return false;

    // Filtrar por fecha "Hasta"
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // incluir todo el día
      if (orderDate > toDate) return false;
    }

    // Filtrar por estado
    if (statusFilter !== "todos" && order.estado !== statusFilter) return false;

    return true;
  });

  return (
    <div className={styles.ordersContainer}>
      {/* -------------------------
          FILTROS
      --------------------------- */}
      <div className={styles.filters}>
        <div>
          <label>Desde:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label>Hasta:</label>
          <input
            type="date"
            value={dateTo}
            max={new Date().toISOString().split("T")[0]} //no permitir fechas futuras
            onChange={e => setDateTo(e.target.value)}
          />
        </div>

        <div>
          <label>Estado:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* -------------------------
          TABLA DE PEDIDOS
      --------------------------- */}
      {filteredOrders.length === 0 ? (
        <div className={styles.noPedidos}>No hay pedidos que coincidan con los filtros</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha y hora</th>
              <th>Dirección</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id_pedido}>
                <td>#{o.id_pedido}</td>
                <td>{new Date(o.fecha).toLocaleString("es-AR")}</td>
                <td title={o.direccion}>{o.direccion?.substring(0, 30)}...</td>
                <td>
                  <span style={{ 
                    backgroundColor: getStatusColor(o.estado),
                    color: "white",
                    fontWeight: "700",
                    fontSize: "12px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    display: "inline-block",
                    whiteSpace: "nowrap"
                  }}>
                    ● {o.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      )}
    </div>
  );
}