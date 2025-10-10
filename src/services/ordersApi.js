import authApi from "../libs/axios";

const normalizeEstado = (s) => {
  if (!s) return "Pendiente";
  const key = String(s).toLowerCase().trim();
  const map = {
    "pendiente": "Pendiente",
    "asignado": "Asignado",
    "en curso": "En curso",
    "entregado": "Entregado",
  };
  return map[key] ?? (s.charAt(0).toUpperCase() + s.slice(1));
};

const mapPedido = (p) => ({
  id: p.id_pedido,
  assignedTo: p.id_repartidor ?? null,
  direccion: p.direccion_destino ?? p.direccion_origen ?? "",
  // cliente puede venir como objeto; intentamos mostrar algo legible
  cliente:
    p.cliente?.nombre ??
    p.cliente?.nombre_completo ??
    (p.id_cliente ? `Cliente #${p.id_cliente}` : "Cliente desconocido"),
  // normalizamos el estado a una cadena amigable (minusculas/formatos en UI)
  status: (p.estado?.nombre_estado ?? "Pendiente").toLowerCase(),
  // mantenemos el raw por si se necesita más info en UI
  _raw: p,
});

/**
 * GET /pedidos/disponibles
 */
export async function getOrders() {
  try {
    const res = await authApi.get("/pedidos/disponibles");
    const raw = res.data;
    const mapped = Array.isArray(raw) ? raw.map(mapPedido) : [];
    return mapped;
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error al obtener pedidos${status ? ` (status ${status})` : ""}`);
  }
}

/**
 * GET /pedidos/monitor/:id
 * Devuelve el pedido mapeado (usa controller monitorPedido que responde { message, pedido })
 */
export async function getOrder(id_pedido) {
  try {
    const res = await authApi.get(`/pedidos/monitor/${id_pedido}`);
    const pedidoRaw = res.data?.pedido ?? null;
    return pedidoRaw ? mapPedido(pedidoRaw) : null;
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error al obtener pedido${status ? ` (status ${status})` : ""}`);
  }
}

/**
 * PUT /pedidos/asignar/:id
 * Body: { id_repartidor }
 */
export async function reassignOrder(id_pedido, id_repartidor) {
  try {
    const res = await authApi.put(`/pedidos/asignar/${id_pedido}`, { id_repartidor });
    // el backend devuelve { message, pedido } — retornamos el pedido mapeado
    const pedidoRaw = res.data?.pedido ?? null;
    return pedidoRaw ? mapPedido(pedidoRaw) : res.data;
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error reasignando pedido${status ? ` (status ${status})` : ""}`);
  }
}

/**
 * PUT /pedidos/estado/:id
 * Body: { nuevoEstado } (el backend espera nombre de estado, ej. "Asignado", "Entregado")
 * Recibe 'status' desde UI (ej. 'asignado'|'en curso'|'entregado'|'pendiente')
 */
export async function updateOrderStatus(id_pedido, status) {
  try {
    const nuevoEstado = normalizeEstado(status);
    const res = await authApi.put(`/pedidos/estado/${id_pedido}`, { nuevoEstado });
    const pedidoRaw = res.data?.pedido ?? null;
    return pedidoRaw ? mapPedido(pedidoRaw) : res.data;
  } catch (err) {
    const statusCode = err.response?.status;
    throw new Error(`Error actualizando estado${statusCode ? ` (status ${statusCode})` : ""}`);
  }
}