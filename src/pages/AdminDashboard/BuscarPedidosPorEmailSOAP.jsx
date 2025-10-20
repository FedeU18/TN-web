import React, { useState } from 'react';

function BuscarPedidosPorEmailSOAP() {
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
      // Construir el XML SOAP
      const xml = `<?xml version="1.0" encoding="utf-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tn-api/soap">
          <soapenv:Header/>
          <soapenv:Body>
            <tns:getPedidosPorEmail>
              <email>${email}</email>
            </tns:getPedidosPorEmail>
          </soapenv:Body>
        </soapenv:Envelope>`;
      const res = await fetch('http://localhost:8001/wsdl', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
        },
        body: xml,
      });
      const text = await res.text();
      // Parsear la respuesta SOAP (para demo)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const pedidoNodes = xmlDoc.getElementsByTagName('pedido');
      const pedidosArr = Array.from(pedidoNodes).map(node => ({
        id: node.getElementsByTagName('id')[0]?.textContent,
        estado: node.getElementsByTagName('estado')[0]?.textContent,
        fecha: node.getElementsByTagName('fecha')[0]?.textContent,
        direccion_origen: node.getElementsByTagName('direccion_origen')[0]?.textContent,
        direccion_destino: node.getElementsByTagName('direccion_destino')[0]?.textContent,
      }));
      setPedidos(pedidosArr);
    } catch (err) {
      setError('Error al consultar pedidos (SOAP)');
    } finally {
      setLoading(false);
      const fin = performance.now();
      setTiempo((fin - inicio).toFixed(2));
    }
  };

  return (
    <div>
      <h2>Buscar pedidos por email (SOAP directo)</h2>
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
                  <td>{p.direccion_origen}</td>
                  <td>{p.direccion_destino}</td>
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

export default BuscarPedidosPorEmailSOAP;
