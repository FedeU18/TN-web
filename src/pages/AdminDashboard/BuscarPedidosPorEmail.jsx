import React, { useState } from 'react';

function BuscarPedidosPorEmail() {
  const [email, setEmail] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tiempo, setTiempo] = useState(null);

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
      const fin = performance.now();
      setTiempo((fin - inicio).toFixed(2));
    }
  };

  return (
    <div>
      <h2>Buscar pedidos por email</h2>
      <form onSubmit={handleBuscar}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email del usuario"
          required
        />
        <button type="submit" disabled={loading}>Buscar</button>
      </form>
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {pedidos.length > 0 && (
        <>
          <p>Tiempo de búsqueda: <b>{tiempo} ms</b></p>
          <table>
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
                  <td>{p.fecha}</td>
                  <td>{p.direccion_origen || p.origen || '-'}</td>
                  <td>{p.direccion_destino || p.destino || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {pedidos.length === 0 && !loading && !error && <p>No hay pedidos para este email.</p>}
    </div>
  );
}

export default BuscarPedidosPorEmail;
