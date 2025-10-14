import axios from "../libs/axios";

export const getEstadoPedido = async (pedidoId) => {
  try {
    const response = await axios.get(`/pedidos/${pedidoId}/estado`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estado del pedido:", error);
    throw error;
  }
};

export const getPedidosCliente = async () => {
  const response = await axios.get("/clientes/pedidos");
  return response.data;
};

export const getDetallePedidoCliente = async (id_pedido) => {
  const response = await axios.get(`/pedidos/${id_pedido}`);
  return response.data;
};
