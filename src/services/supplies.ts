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

//lista pública de abrigos próximos ao endereço informado, para que possam fazer doações mais direcionadas
//envia latitude, longitude e o raio de distância em quilômetros, definido por padrão como 10km.
export const getNearbySupplies = async (latitude: number, longitude: number, radius = 10) => {
  const response = await api.get("/supplies/nearby", {
    params: {
      lat: latitude,
      lng: longitude,
      radius
    }
  });

  return response.data;
}

export const updateSupply = async (id: number, item: Supply) => {
  const response = await api.put(`/supplies/${id}`, item);
  return response.data;
};

export const deleteSupply = async (id: number) => {
  const response = await api.delete(`/supplies/${id}`);
  return response.data;
};