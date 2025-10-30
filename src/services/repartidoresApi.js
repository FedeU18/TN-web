import api from "../libs/axios";

export const calificarRepartidor = async (id_pedido, calificacion) => {
  try {
    const response = await api.post("/repartidores/calificar", {
      id_pedido,
      calificacion,
    });
    return response.data;
  } catch (error) {
    console.error("Error al calificar al repartidor:", error);
    throw error;
  }
};