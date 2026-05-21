import { api } from "./api";

interface RegisterData {
  name: string;
  nickname: string;
  description: string;
  address: string;
  email: string;
  password: string;
  latitude: number | string;
  longitude: number | string;
  type: string;
  capacity: number | string;
  photo_url: string;
}

export const registerShelter = async (data: RegisterData) => {
  const response = await api.post("/shelters/register", data);
  return response.data;
};

export const getAllShelters = async () => {
  const response = await api.get("/shelters");
  return response.data;
}

export const getShelterById = async (shelter_id: number) => {
  const response = await api.get(`/shelters/${shelter_id}`);
  return response.data;
};

export const getMyShelter = async () => {
  const response = await api.get("/shelters/me");
  return response.data;
};


interface UpdateData {
  name: string;
  nickname: string;
  description: string;
  address: string;
  password: string;
  latitude: number | string;
  longitude: number | string;
  capacity: number | string;
  status: string;
  photo_url: string;
}

export const updateShelter = async (data: UpdateData) => {
  const response = await api.put("/shelters/update", data);
  return response.data;
};