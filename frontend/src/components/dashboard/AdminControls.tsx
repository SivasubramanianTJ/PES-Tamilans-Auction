import { useEffect, useState } from "react";

import {
  getCurrentAuction,
  getRemainingPlayers,
  startPlayerAuction,
  finishPlayerAuction,
  finishSeason,
  exportExcel,
} from "../../api/auction";

function AdminControls() {
  const [auction, setAuction] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  useEffect(() => {
    loadAuction();
    loadPlayers();
  }, []);

  async function loadAuction() {
    const res = await getCurrentAuction();
    setAuction(res.data.data);
  }

  async function loadPlayers() {
    const res = await getRemainingPlayers();
    setPlayers(res.data.data);
  }

  async function startAuction() {
    if (!selectedPlayer) {
      alert("Select a player");
      return;
    }

    await startPlayerAuction(selectedPlayer as any);

    loadAuction();
    loadPlayers();
  }

  async function finishAuctionSeason() {
  try {
    await finishSeason();

    alert("Auction Finished Successfully");

    loadAuction();
    loadPlayers();
  } catch (error) {
    console.error(error);
    alert("Failed to finish auction");
  }
}

async function downloadExcel() {
  try {
    const response = await exportExcel();

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "PES-Tamilans-Auction.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    alert("Failed to export excel");
  }
}
  

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Auction Controls
      </h1>

      <div className="bg-slate-800 rounded-xl p-6 space-y-3">

        <p>
          <strong>Live Player:</strong>{" "}
          {auction?.player ?? "None"}
        </p>

        <p>
          <strong>Current Bid:</strong>{" "}
          ₹{auction?.currentBid ?? 0}
        </p>

        <p>
          <strong>Highest Team:</strong>{" "}
          {auction?.currentTeam ?? "-"}
        </p>

      </div>

      <div className="bg-slate-800 rounded-xl p-6 space-y-4">

        <select
          className="w-full bg-slate-700 p-3 rounded"
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
        >
          <option value="">
            Select Player
          </option>

          {players.map((player) => (
            <option
              key={player.id}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
        </select>

        <button
          onClick={startAuction}
          className="bg-green-600 px-5 py-3 rounded-lg"
        >
          Start Player Auction
        </button>

      </div>

      <div className="flex gap-4">

  <button
    onClick={() => finishAuction(true)}
    className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg flex-1"
  >
    Mark SOLD
  </button>

  <button
    onClick={() => finishAuction(false)}
    className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg flex-1"
  >
    Mark UNSOLD
  </button>

</div>

<button
  onClick={finishAuctionSeason}
  className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg"
>
  Finish Auction
</button>

<button
  onClick={downloadExcel}
  className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
>
  Export Excel
</button>

    </div>
  );
  
}

async function finishAuction(sold: boolean) {
  try {
    await finishPlayerAuction(sold);

    await loadAuction();
    await loadPlayers();

    alert(sold ? "Player Sold" : "Player Unsold");
  } catch (error) {
    console.error(error);
    alert("Failed to finish auction");
  }
}


export default AdminControls;

function loadAuction() {
    throw new Error("Function not implemented.");
}
function loadPlayers() {
    throw new Error("Function not implemented.");
}

