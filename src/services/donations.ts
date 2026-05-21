import { api } from "./api";

export type Donation = {
  id: number;
  item_name: string;
  quantity: number;
  created_at: string;
  expires_at: string;
  status: "active" | "completed" | "expired";
};

export type DonationReservation = {
  shelter_id: number;
  supply_id: number;
  quantity: number;
};

//Cria a reserva de doação
export const createReservation = async (data: DonationReservation) => {
  const response = await api.post("/donations", data);
  return response;
}

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