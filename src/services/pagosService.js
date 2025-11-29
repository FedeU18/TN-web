import axios from "../libs/axios";

/**
 * Obtener estado de pago de un pedido
 */
export const obtenerEstadoPago = async (id_pedido) => {
  try {
    const response = await axios.get(`/pagos/estado/${id_pedido}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener estado de pago:", error);
    throw error;
  }
};

/**
 * Crear preferencia de pago en Mercado Pago
 * Retorna el init_point (URL del checkout)
 */
export const crearPreferenciaPago = async (id_pedido) => {
  try {
    const response = await axios.post(`/pagos/crear-preferencia/${id_pedido}`);
    return response.data;
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error);
    throw error;
  }
};

/**
 * Obtener información de un pedido (para verificar estado)
 */
export const obtenerDetallePedido = async (id_pedido) => {
  try {
    const response = await axios.get(`/clientes/pedidos/${id_pedido}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    throw error;
  }
};
