import api from "../libs/axios";

const STATE_MAP = {
  1: "pendiente",
  2: "asignado",
  3: "en camino",
  4: "entregado",
};

const mapPedido = (p) => ({
  id: p.id_pedido ?? null,
  assignedTo: p.id_repartidor ?? null,
  direccion: p.direccion_destino ?? p.direccion_origen ?? "",
  cliente:
    p.cliente?.nombre ??
    (p.cliente?.nombre_completo ? p.cliente.nombre_completo : (p.id_cliente ? `Cliente #${p.id_cliente}` : "Cliente desconocido")),
  status: (p.estado?.nombre_estado ?? STATE_MAP[p.id_estado] ?? "Pendiente").toLowerCase(),
  _raw: p,
});

/**
 * Pedidos disponibles (sin cambiar) -> /pedidos/disponibles
 */
export async function getOrdersDisponibles() {
  try {
    const res = await api.get("/pedidos/disponibles");
    return Array.isArray(res.data) ? res.data.map(mapPedido) : [];
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error al obtener pedidos disponibles${status ? ` (status ${status})` : ""}`);
  }
}

/**
 * TODOS los pedidos (para admin) -> /pedidos
 */
export async function getAllOrders() {
  try {
    const res = await api.get("/pedidos");
    //el controller devuelve array de pedidos o 404 si no hay ninguno
    return Array.isArray(res.data) ? res.data.map(mapPedido) : [];
  } catch (err) {
    const status = err.response?.status;
    //si backend devuelve 404 "No hay pedidos registrados", tratamos como [] en frontend
    if (status === 404) return [];
    throw new Error(`Error al obtener pedidos${status ? ` (status ${status})` : ""}`);
  }
}

export async function getOrder(id_pedido) {
  try {
    const res = await api.get(`/pedidos/monitor/${id_pedido}`);
    const raw = res.data?.pedido ?? res.data ?? null;
    return raw ? mapPedido(raw) : null;
  } catch (err) {
    throw err;
  }
}

export async function getClientePedidos(clienteId) {
  try {
    const res = await api.get(`/clientes/${clienteId}/pedidos`);
    return res.data; //array pedidos
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error al obtener pedidos${status ? ` (status ${status})` : ""}`);
  }
}

//mas vale q funques wachin
export async function reassignOrder(id_pedido, id_repartidor) {
  const driverId = Number(id_repartidor);
  if (isNaN(driverId)) throw new Error("ID de repartidor inválido");

  try {
    const res = await api.put(`/pedidos/asignar/${id_pedido}`, { id_repartidor: driverId });
    const raw = res.data?.pedido ?? res.data ?? null;
    return raw ? mapPedido(raw) : res.data;
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error reasignando pedido${status ? ` (status ${status})` : ""}`);
  }
}

export async function updateOrderStatus(id_pedido, status) {
  try {
    const nuevoEstado = (status || "Pendiente").replace(/^./, s => s.toUpperCase());
    const res = await api.put(`/pedidos/estado/${id_pedido}`, { nuevoEstado });
    const raw = res.data?.pedido ?? res.data ?? null;
    return raw ? mapPedido(raw) : res.data;
  } catch (err) {
    const statusCode = err.response?.status;
    throw new Error(`Error actualizando estado${statusCode ? ` (status ${statusCode})` : ""}`);
  }
}