import api from "./axios";

export function getAllPlayers() {
  return api.get("/players");
}

export function deletePlayer(id: string) {
  return api.delete(`/players/${id}`);
}

export function updatePlayer(
  id: string,
  data: {
    name: string;
    phoneNumber: string;
  }
) {
  return api.patch(`/players/${id}`, data);
}