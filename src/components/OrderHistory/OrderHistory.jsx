import { useEffect, useState } from "react";
import axios from "../../libs/axios";
import styles from "./OrderHistory.module.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users/me/orders");
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Cargando pedidos...</div>;
  if (orders.length === 0) return <div>No hay pedidos registrados</div>;

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
      <h2>Historial de pedidos</h2>

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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Dirección</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map(o => (
            <tr key={o.id_pedido}>
              <td>{o.id_pedido}</td>
              <td>{new Date(o.fecha).toLocaleString()}</td>
              <td>{o.direccion}</td>
              <td>{o.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <p>No hay pedidos que coincidan con los filtros.</p>
      )}
    </div>
  );
}