import React, { useState } from "react";
import "./BuscarPedidosPorEmailSOAP.css";

function BuscarPedidosPorEmailSOAP() {
  const [email, setEmail] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tiempo, setTiempo] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPedidos([]);
    setTiempo(null);
    const inicio = performance.now();
    try {
      // Construir el XML SOAP
      const xml = `<?xml version="1.0" encoding="utf-8"?>
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tn-api/soap">
              <soapenv:Header/>
              <soapenv:Body>
                <tns:getPedidosPorEmailRequest>
                  <email>${email}</email>
                </tns:getPedidosPorEmailRequest>
              </soapenv:Body>
            </soapenv:Envelope>`;
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wsdl`, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
        },
        body: xml,
      });
      const text = await res.text();
      // Parsear la respuesta SOAP (para demo)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const pedidoNodes = xmlDoc.getElementsByTagName("pedido");
      const pedidosArr = Array.from(pedidoNodes).map((node) => ({
        id: node.getElementsByTagName("id")[0]?.textContent,
        estado: node.getElementsByTagName("estado")[0]?.textContent,
        fecha: node.getElementsByTagName("fecha")[0]?.textContent,
        direccion_origen:
          node.getElementsByTagName("direccion_origen")[0]?.textContent,
        direccion_destino:
          node.getElementsByTagName("direccion_destino")[0]?.textContent,
      }));
      setPedidos(pedidosArr);
    } catch (err) {
      setError("Error al consultar pedidos (SOAP)");
    } finally {
      setLoading(false);
      setSearched(true);
      const fin = performance.now();
      setTiempo((fin - inicio).toFixed(2));
    }
  };

  // Función auxiliar para formatear fechas ISO a formato legible local
  function formatFechaIso(iso) {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch (e) {
      return iso;
    }
  }

  return (
    <div className="soap-search-wrapper">
      <div className="soap-search-card">
        <div className="soap-search-header">
          <h2>Buscar pedidos por email (SOAP directo)</h2>
        </div>
        <form className="soap-search-form" onSubmit={handleBuscar}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email del usuario"
            required
          />
          <button type="submit" disabled={loading}>
            Buscar
          </button>
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        {pedidos.length > 0 && (
          <>
            <p className="soap-time">
              Tiempo de búsqueda: <b>{tiempo} ms</b>
            </p>
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
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.estado}</td>
                    <td>{formatFechaIso(p.fecha)}</td>
                    <td>{p.direccion_origen}</td>
                    <td>{p.direccion_destino}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {pedidos.length === 0 && !loading && !error && searched && (
          <p className="soap-empty">No hay pedidos para este email.</p>
        )}
      </div>
    </div>
  );
}

export default BuscarPedidosPorEmailSOAP;
