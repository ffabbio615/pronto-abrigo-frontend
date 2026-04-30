import { api } from "./api";

type Supply = {
  name?: string;
  current_quantity: number;
  min_quantity: number;
  max_quantity: number;
};

export const createSupply = async (item: Supply) => {
  const response = await api.post("/supplies", item);
  return response.data
}

export const getSupplies = async () => {
  const response = await api.get("/supplies");
  return response.data;
};

export const updateSupply = async (id: number, item: Supply) => {
  const response = await api.put(`/supplies/${id}`, item);
  return response.data;
};

export const deleteSupply = async (id) => {
  const response = await api.delete(`/supplies/${id}`);
  return response.data;
};