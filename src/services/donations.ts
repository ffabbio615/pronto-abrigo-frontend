import { api } from "./api";

export type Donation = {
  id: number;
  item_name: string;
  quantity: number;
  created_at: string;
  expires_at: string;
  status: "active" | "completed" | "expired";
};

//lista de doações do abrigo logado
export const getDonations = async () => {
  const response = await api.get("/donations");
  return response.data;
};

//lista de doações ativas do abrigo logado
export const getActiveDonations = async () => {
  const response = await api.get("/donations/active");
  return response.data;
};

export const completeActiveDonation = async (id: number) => {
  const response = await api.put(`/donations/${id}/complete`);
  return response.data;
};