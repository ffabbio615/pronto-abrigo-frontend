import { api } from "./api";

export type Entity = {
    type: string,
    name: string,
    birth_date: string,
    estimated_age: string,
    species?: string,
    breed?: string,
    description: string,
    photo_url: string | null,
    allow_public_photo: boolean,
    status: string
}

export const createEntity = async (data: Entity) => {
  const response = await api.post("/entities", data);
  return response.data;
};