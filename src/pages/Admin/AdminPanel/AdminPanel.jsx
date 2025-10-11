import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderCard from '../../../components/OrderCard/OrderCard';
import * as api from '../../../services/ordersApi';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('todos'); //todos | asignados | no-asignados
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      //usar endpoint de admin que devuelve todos los pedidos
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
      alert('No se pudieron cargar los pedidos');
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

  return (
    <div>
      <h1>Panel de pedidos (admin)</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setFilter('todos')}>Todos</button>
        <button onClick={() => setFilter('asignados')} style={{ marginLeft: 8 }}>Asignados</button>
        <button onClick={() => setFilter('no-asignados')} style={{ marginLeft: 8 }}>No asignados</button>
        <button onClick={refresh} style={{ marginLeft: 16 }}>Actualizar</button>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(o => (
            <OrderCard
              key={o.id}
              order={o}
              onReassign={async (id, driver) => {
                await api.reassignOrder(id, driver);
                refresh();
              }}
            />
          ))}
          {filtered.length === 0 && <div>No hay pedidos</div>}
        </div>
      )}
      <div>
        <Link to="/admin-dashboard" style={{ display: 'inline-block', marginTop: 20 }}>
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}