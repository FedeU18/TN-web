import { useEffect, useState } from "react";
import axios from "../../libs/axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users/me/orders");
      setOrders(res.data);
    } catch (e) {
      console.error(e);
      //alert("No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <div>Cargando pedidos...</div>;

  if (orders.length === 0) return <div>No hay pedidos registrados</div>;

  return (
    <div>
      <h2>Historial de pedidos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Dirección</th>
            <th>Estado</th>
            {/* <th>Detalle</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id_pedido}>
              <td>{o.id_pedido}</td>
              <td>{new Date(o.fecha).toLocaleString()}</td>
              <td>{o.direccion}</td>
              <td>{o.estado}</td>
              {/* <td>
                <button onClick={() => alert(`Detalle del pedido #${o.id_pedido}`)}>
                  Ver
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}