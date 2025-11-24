import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderCard from '../../../components/OrderCard/OrderCard';
import * as api from '../../../services/ordersApi';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); 
  const ORDERS_PER_PAGE = 3; 

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders();
      setOrders(data);
      setPage(1); // resetear página al refrescar
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = orders.filter(o => {
    if (filter === 'asignados') return !!o.assignedTo;
    if (filter === 'no-asignados') return !o.assignedTo;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE);
  const startIndex = (page - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = filtered.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Panel de pedidos (Admin)</h1>

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'todos' ? styles.active : ''}`}
          onClick={() => setFilter('todos')}
        >
          Todos
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'asignados' ? styles.active : ''}`}
          onClick={() => setFilter('asignados')}
        >
          Asignados
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'no-asignados' ? styles.active : ''}`}
          onClick={() => setFilter('no-asignados')}
        >
          No asignados
        </button>
        <button className={styles.refreshButton} onClick={refresh}>
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : (
        <>
          <div className={styles.ordersGrid}>
            {paginatedOrders.map(o => (
              <OrderCard
                key={o.id}
                order={o}
                onReassign={async (id, driver) => {
                  await api.reassignOrder(id, driver);
                  refresh();
                }}
              />
            ))}
            {filtered.length === 0 && <div className={styles.noOrders}>No hay pedidos</div>}
          </div>

          {/* Paginación */}
            {filtered.length > ORDERS_PER_PAGE && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  «
                </button>

                {/* Números de página */}
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
        </>
      )}
    </div>
  );
}