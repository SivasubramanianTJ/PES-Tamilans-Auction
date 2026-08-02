import api from "./axios";

export const createTeam = (data: {
  name: string;
  logoUrl?: string;
}) => {
  return api.post("/teams", data);
};

export const getAllTeams = () => {
  return api.get("/teams");
};

export const getAvailableCaptains = () => {
  return api.get("/teams/available-captains");
};

export const assignCaptain = (data: {
  teamId: string;
  captainUserId: string;
}) => {
  return api.patch("/teams/assign-captain", data);
};

export function removeCaptain(teamId: string) {
  return api.patch(`/teams/${teamId}/remove-captain`);
}

export const deleteTeam = (teamId: string) => {
  return api.delete(`/teams/${teamId}`);
};
