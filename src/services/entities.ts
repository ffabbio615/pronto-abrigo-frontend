import { api } from "./api";

export type Entity = {
    type: string,
    name: string | null,
    birth_date: string | null,
    estimated_age: string,
    species?: string | null,
    breed?: string | null,
    description: string,
    photo_url?: string | null,
    allow_public_photo: boolean,
    status: string,
}

export const createEntity = async (data: Entity) => {
  const response = await api.post("/entities", data);
  return response.data;
};

export const getEntities = async () => {
  const response = await api.get("/entities");
  return response.data;
};

export const getEntitiesByShelter = async() =>{
  const response = await api.get('/entities/private');
  return response.data;
}

type UpdateEntity = {
  id: number;
  type: "person" | "animal";
  name: string;
  birth_date?: string;
  estimated_age?: number;
  species?: string;
  breed?: string;
  description?: string;
  photo_url?: string;
  allow_public_photo: boolean;
  status: "in_shelter" | "looking_for_family" | "reunited" | "released";
  exit_reason?: string;
  created_at: string;
};

export const updateEntity = async (id: number, data: UpdateEntity) => {
  const response = await api.put(`/entities/${id}`, data);
  return response.data;
};