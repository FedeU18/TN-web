import api from "../libs/axios";

// Obtener todos los usuarios
export const getAllUsuarios = async () => {
  const res = await api.get("/admin/usuarios");
  return res.data;
};

// Actualizar rol de un usuario
export const updateUserRol = async (id, rol) => {
  const res = await api.put(`/admin/usuarios/${id}/rol`, { rol });
  return res.data;
};

// Obtener repartidores con calificaciones
export const getRepartidoresConCalificaciones = async () => {
  const res = await api.get("/admin/repartidores/calificaciones");
  return res.data;
};

// Obtener calificaciones de un repartidor específico
export const getCalificacionesDeRepartidor = async (id) => {
  const res = await api.get(`/admin/repartidores/${id}/calificaciones`);
  return res.data;
};
