// src/services/vendedor.js
import api from "../libs/axios";

export async function crearPedidoVendedor(payload) {
  try {
    const { data } = await api.post("/vendedor/crear-pedido", payload);
    return data;
  } catch (error) {
    console.error("Error creando pedido del vendedor:", error);
    throw error.response?.data || error;
  }
}

export async function getAllClientes() {
  try {
    const { data } = await api.get("/clientes");
    return data.data; // backend retorna { ok:true, data:[...] }
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    throw error.response?.data || error;
  }
}

export async function getMisPedidosVendedor() {
  try {
    const { data } = await api.get("/vendedor/mis-pedidos");
    return data;
  } catch (error) {
    console.error("Error obteniendo pedidos del vendedor:", error);
    throw error.response?.data || error;
  }
}

export async function getDetallePedidoVendedor(id_pedido) {
  try {
    const { data } = await api.get(`/vendedor/pedido/${id_pedido}`);
    return data;
  } catch (error) {
    console.error("Error obteniendo detalle del pedido:", error);
    throw error.response?.data || error;
  }
}
