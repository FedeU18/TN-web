import api from "../libs/axios";

export const getAllPedidosAdmin = async () => {
  const res = await api.get("/pedidos");
  return res.data;
};