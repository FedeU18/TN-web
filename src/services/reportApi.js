import api from "../libs/axios";

/**
 * Llama a /reportes/desempeno
 * Params opcionales: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', repartidorId }
 * Se espera respuesta: { kpis: {...}, series: [{ fecha, entregados, cancelados, tiempoPromedio }], repartidores: [...] }
 */
export async function getPerformance({ startDate, endDate, repartidorId } = {}) {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (repartidorId) params.repartidorId = repartidorId;
    const res = await api.get("/reportes/desempeno", { params });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    throw new Error(`Error al obtener reportes${status ? ` (status ${status})` : ""}`);
  }
}