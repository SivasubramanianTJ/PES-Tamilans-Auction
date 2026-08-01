import api from "./axios";

export const getTeams = () => api.get("/teams");

export const createTeam = (data: {
  name: string;
  logoUrl?: string;
}) => api.post("/teams", data);

export const getAvailableCaptains = () =>
  api.get("/teams/available-captains");

export const assignCaptain = (
  teamId: string,
  captainUserId: string
) =>
  api.patch("/teams/assign-captain", {
    teamId,
    captainUserId,
  });

export const deleteTeam = (teamId: string) =>
  api.delete(`/teams/${teamId}`);