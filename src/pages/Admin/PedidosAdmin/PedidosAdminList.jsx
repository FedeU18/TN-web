import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPedidosAdmin } from "../../../services/pedidosAdmin";
import styles from "./PedidosAdminList.module.css";

export default function PedidosAdminList() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const PEDIDOS_POR_PAGINA = 8;

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getAllPedidosAdmin();
        const pedidosOrdenados = data.sort((a, b) => a.id_pedido - b.id_pedido);
        setPedidos(pedidosOrdenados);
        setPage(1); // resetear página al cargar
      } catch (err) {
        setError("No se pudieron cargar los pedidos.");
        console.error(err);
      }
    };
    fetchPedidos();
  }, []);

  const totalPages = Math.ceil(pedidos.length / PEDIDOS_POR_PAGINA);
  const startIndex = (page - 1) * PEDIDOS_POR_PAGINA;
  const pedidosPaginados = pedidos.slice(startIndex, startIndex + PEDIDOS_POR_PAGINA);

  if (error) return <p className={styles.error}>{error}</p>;
  if (pedidos.length === 0) return <p className={styles.empty}>No hay pedidos registrados.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pedidos del sistema</h1>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Repartidor</th>
            <th>Estado</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosPaginados.map((p) => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>
              <td>{p.cliente?.nombre} {p.cliente?.apellido}</td>
              <td>{p.repartidor ? `${p.repartidor.nombre} ${p.repartidor.apellido}` : "Sin asignar"}</td>
              <td>{p.estado?.nombre_estado}</td>
              <td>{p.direccion_origen}</td>
              <td>{p.direccion_destino}</td>
              <td>
                <Link to={`/admin-panel/pedido/${p.id_pedido}`} className={styles.link}>
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/*paginacion*/}
      {pedidos.length > PEDIDOS_POR_PAGINA && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            «
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`${styles.pageButton} ${page === num ? styles.activePage : ''}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            className={styles.pageButton}
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      )}

        <br />
      <div>
        <Link to="/admin-dashboard" className={styles.backLink}>Volver al Dashboard</Link>
      </div>
    </div>
  );
}