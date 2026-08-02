import api from "./axios";

export const getCurrentAuction = () => {
  return api.get("/live-auction/current");
};

export const getBidHistory = () => {
  return api.get("/live-auction/bids");
};

export const getRemainingPlayers = () => {
  return api.get("/live-auction/players");
};

export const getLiveTeams = () => {
  return api.get("/teams/live");
};

export const startPlayerAuction = (seasonPlayerId: number) => {
  return api.post("/live-auction/start-player", {
    seasonPlayerId,
  });
};

export const placeBid = (teamId: string) => {
  return api.post("/live-auction/place-bid", {
    teamId,
  });
};

export const finishPlayerAuction = (sold: boolean) => {
  return api.post("/live-auction/finish-player", {
    sold,
  });
};

export function assignRetention(data: {
  seasonPlayerId: string;
  teamId: string;
  soldPrice: number;
}) {
  return api.post("/auction/retention", data);
}

export const exportExcel = () => {
  return api.get("/export/excel", {
    responseType: "blob",
  });
};

export const finishSeason = () => {
  return api.post("/season/finish");
};