import { api } from "./api";

export const getSupplies = async () => {
  const response = await api.get("/supplies");
  return response.data;
};