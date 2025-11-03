import api from "../libs/axios";

export const calificarRepartidor = async ({
  id_pedido,
  puntuacion,
  comentario,
}) => {
  try {
    const response = await api.post("/repartidores/calificar", {
      pedidoId: id_pedido, // el backend espera este nombre
      puntuacion,
      comentario,
    });
    return response.data;
  } catch (error) {
    console.error("Error al calificar al repartidor:", error);
    throw error;
  }
};
