import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidosSinCalificar } from "../../../services/pedidosCliente";
import styles from "./MisPedidosSinCalificar.module.css";

export default function MisPedidosSinCalificar() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosSinCalificar();
        console.log(data);
        setPedidos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pedidos sin calificar.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loading) return <p className={styles.loading}>Cargando pedidos...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Pedidos sin calificar</h2>

      {pedidos.length === 0 ? (
        <p className={styles.noPedidos}>
          No tienes pedidos pendientes de calificar.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Estado</th>
                <th>Repartidor</th>
                <th>Fecha de entrega</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id_pedido}>
                  <td>#{pedido.id_pedido}</td>
                  <td>{pedido.estado?.nombre_estado || "Sin estado"}</td>
                  <td>
                    {pedido.repartidor
                      ? `${pedido.repartidor.nombre} ${pedido.repartidor.apellido}`
                      : "No asignado"}
                  </td>
                  <td>
                    {pedido.fecha_entrega
                      ? new Date(pedido.fecha_entrega).toLocaleDateString(
                          "es-AR"
                        )
                      : "—"}
                  </td>
                  <td>
                    <Link
                      to={`/calificar-repartidor/${pedido.id_pedido}`}
                      className={styles.calificarBtn}
                    >
                      Calificar
                    </Link>
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
