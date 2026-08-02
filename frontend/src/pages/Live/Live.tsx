import { useEffect, useState } from "react";

import { getCurrentAuction } from "../../api/auction";

import socket from "../../socket/socket";

function Live() {

    const [auction, setAuction] = useState<any>(null);
    const [timer, setTimer] = useState(10);

useEffect(() => {
  loadAuction();

  socket.on("auction:timer", (value) => {
    setTimer(value);
  });

  socket.on("auction:start-player", () => {
    loadAuction();
  });

  socket.on("auction:new-bid", () => {
    loadAuction();
  });

  socket.on("auction:player-sold", () => {
    loadAuction();
  });

  socket.on("auction:player-unsold", () => {
    loadAuction();
  });

  return () => {
    socket.off("auction:timer");
    socket.off("auction:start-player");
    socket.off("auction:new-bid");
    socket.off("auction:player-sold");
    socket.off("auction:player-unsold");
  };
}, []);

async function loadAuction() {
  const res = await getCurrentAuction();

  setAuction(res.data.data);
}

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">

      <h1 className="text-5xl font-bold text-center">
        PES TAMILANS LIVE AUCTION
      </h1>

      {!auction ? (

        <div className="text-center mt-20 text-2xl">
          Waiting for auction...
        </div>

      ) : (

        <div className="mt-10">

          <h2 className="text-4xl font-bold">
            {auction.player}
          </h2>

          <p className="mt-3 text-2xl">
            Current Bid :
            <p className="text-2xl mt-3">
  Timer : {timer}s
</p>
            {auction.currentBid}
          </p>

          <p className="text-2xl">
            Leading Team :
            {auction.currentTeam ?? "No Bids Yet"}
          </p>

        </div>

      )}

    </div>
  );
}

export default Live;