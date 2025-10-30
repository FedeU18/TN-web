import React, { useState } from 'react';
import './BuscarPedidosPorEmailSOAP.css';

// Función auxiliar para formatear fechas ISO a formato legible local
function formatFechaIso(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  } catch (e) {
    return iso;
  }
}

function BuscarPedidosPorEmail() {
  const [email, setEmail] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tiempo, setTiempo] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPedidos([]);
    setTiempo(null);
    const inicio = performance.now();
    try {
      const res = await fetch(`/api/soap-wrapper/pedidos?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setPedidos(data.pedidos || []);
    } catch (err) {
      setError('Error al consultar pedidos');
    } finally {
      setLoading(false);
      setSearched(true);
      const fin = performance.now();
      setTiempo((fin - inicio).toFixed(2));
    }
  };

  return (
    <div className="soap-search-wrapper">
      <div className="soap-search-card">
        <div className="soap-search-header">
          <h2>Buscar pedidos por email</h2>
        </div>
        <form className="soap-search-form" onSubmit={handleBuscar}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email del usuario"
            required
          />
          <button type="submit" disabled={loading}>Buscar</button>
        </form>
        <div className="soap-back-button-container">
          <button
            type="button"
            className="soap-back-button"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Volver
          </button>
        </div>
        {loading && <p className="soap-empty">Cargando...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        {pedidos.length > 0 && (
          <>
            <p className="soap-time">Tiempo de búsqueda: <b>{tiempo} ms</b></p>
            <table className="soap-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Dirección Origen</th>
                  <th>Dirección Destino</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.estado}</td>
                    <td>{formatFechaIso(p.fecha)}</td>
                    <td>{p.direccion_origen || p.origen || '-'}</td>
                    <td>{p.direccion_destino || p.destino || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {pedidos.length === 0 && !loading && !error && <p className="soap-empty">No hay pedidos para este email.</p>}
  {pedidos.length === 0 && !loading && !error && searched && <p className="soap-empty">No hay pedidos para este email.</p>}
      </div>
    </div>
  );
}

export default BuscarPedidosPorEmail;
