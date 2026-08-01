import { useEffect, useState } from "react";
import {
  getCurrentAuction,
  getBidHistory,
  getLiveTeams,
  getRemainingPlayers,
} from "../../api/auction";
import socket from "../../socket/socket";

function Auction() {
  const [auction, setAuction] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [soldPopup] = useState(false);
  const [soldData] = useState<{
  playerName: string;
  teamName: string;
  soldPrice: string;
} | null>(null);
  const [unsoldPopup, setUnsoldPopup] = useState(false);

const [unsoldData, setUnsoldData] = useState<{
  playerName: string;
} | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  

useEffect(() => {
  loadAuction();
  loadBidHistory();
  loadTeams();
  loadPlayers();

  socket.connect();

  socket.on("auction:start-player", () => {
  console.log("Player Started");
  loadAuction();
  loadBidHistory();
});

socket.on("auction:new-bid", () => {
  console.log("New Bid");
  loadAuction();
  loadBidHistory();
  loadTeams();
  loadPlayers();
});

socket.on("auction:timer", (time: number) => {
  setTimeLeft(time);
});

socket.on("auction:player-unsold", (data) => {
  console.log("Player Unsold", data);

  setUnsoldData(data);
  setUnsoldPopup(true);

  setTimeout(() => {
    setUnsoldPopup(false);
    setUnsoldData(null);
  }, 3000);

  setAuction(null);
  setBidHistory([]);

  loadTeams();
  loadPlayers();
});

socket.on("auction:player-unsold", (data) => {
  console.log("Player Unsold", data);

  setUnsoldData(data);
  setUnsoldPopup(true);

  setTimeout(() => {
    setUnsoldPopup(false);
    setUnsoldData(null);
  }, 3000);

  setAuction(null);
  setBidHistory([]);

  loadTeams();
  loadPlayers();
});

  return () => {
    socket.off("auction:start-player");
    socket.off("auction:new-bid");
    socket.off("auction:player-sold");
    socket.off("auction:player-unsold");
    socket.off("auction:timer");
    socket.disconnect();
  };
}, []);

  async function loadAuction() {
    try {
      const response = await getCurrentAuction();
      setAuction(response.data.data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadBidHistory() {
  try {
    const response = await getBidHistory();
    setBidHistory(response.data.data ?? []);
  } catch (error) {
    console.error(error);
  }
}
async function loadTeams() {
  try {
    const response = await getLiveTeams();
    setTeams(response.data.data);
  } catch (error) {
    console.error(error);
  }
}

async function loadPlayers() {
  try {
    const response = await getRemainingPlayers();
    setPlayers(response.data.data);
  } catch (err) {
    console.error(err);
  }
}


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.reload();
}

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
  <>
    <div className="min-h-screen bg-slate-900 text-white p-8">

  <div className="flex justify-between items-center mb-6">

    <h1 className="text-3xl font-bold">
      PES TAMILANS AUCTION
    </h1>

    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
    >
      Logout
    </button>

  </div>

  <div className="flex justify-center items-start gap-8">

      {/* LEFT - LIVE AUCTION */}

{auction ? (

<div className="bg-slate-800 rounded-xl p-8 w-[450px]">

  <h1 className="text-3xl font-bold mb-8">
    🏏 Live Auction
  </h1>
  <div className="flex justify-center mb-6">
  <img
    src={auction.imageUrl}
    alt={auction.player}
    className="w-48 h-48 rounded-2xl object-cover border-4 border-yellow-400 shadow-2xl"
  />
</div>

  <div className="text-center text-4xl font-bold text-yellow-400 mb-6">
    ⏳ {timeLeft}
  </div>

  <p className="mb-3">
    <strong>Player:</strong> {auction.player}
  </p>

  <p className="mb-3">
    <strong>Base Price:</strong> ₹{auction.basePrice}
  </p>

  <hr className="my-6 border-slate-600" />

  <h2 className="text-xl font-semibold mb-4">
    Bid History
  </h2>

  {bidHistory.length === 0 ? (
    <p className="text-slate-400">
      No bids yet
    </p>
  ) : (
    <div className="space-y-2">
      {bidHistory.map((bid, index) => (
        <div
          key={index}
          className="flex justify-between bg-slate-700 rounded p-3"
        >
          <span>{bid.team}</span>
          <span>₹{bid.bidAmount}</span>
        </div>
      ))}
    </div>
  )}

  <div className="mt-6">
    <p className="mb-2">
      <strong>Current Bid:</strong> ₹{auction.currentBid}
    </p>

    <p>
      <strong>Current Team:</strong>{" "}
      {auction.currentTeam ?? "No bids"}
    </p>
  </div>

</div>

) : (

<div className="bg-slate-800 rounded-xl p-8 w-[450px] flex items-center justify-center">

  <h2 className="text-3xl font-bold text-gray-400">
    No Live Auction
  </h2>

</div>

)}

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-6">

        {/* TEAMS */}
        <div className="bg-slate-800 rounded-xl p-6 w-[380px]">

          <h2 className="text-2xl font-bold mb-6">
            Teams
          </h2>

          <div className="space-y-3">

            {teams.map((team) => (

  <div
    key={team.id}
    className={`
bg-slate-700 rounded-lg p-3 flex justify-between items-center
transition-all duration-300
${
  auction?.currentTeam === team.name
    ? "ring-4 ring-yellow-400 bg-yellow-900/40 scale-105"
    : ""
}
`}
  >

    <div className="flex items-center gap-3">

      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-12 h-12 rounded-full object-cover bg-white p-1"
      />

      <div>
        <p className="font-semibold">
          {team.name}
        </p>

        <p className="text-xs text-gray-400">
  {team.captainName}
</p>

<p
  className={`text-xs font-semibold ${
    team.captainOnline
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {team.captainOnline
    ? "🟢 Online"
    : "🔴 Offline"}
</p>
      </div>

    </div>

    <div className="font-bold">
      ₹{team.remainingBudget}
    </div>

  </div>

))}
          </div>

        </div>

        {/* REMAINING PLAYERS */}
        <div className="bg-slate-800 rounded-xl p-6 w-[380px]">

          <h2 className="text-2xl font-bold mb-6">
            Remaining Players
          </h2>

          {players.length === 0 ? (

            <p className="text-gray-400">
              No players remaining
            </p>

          ) : (

            <div className="space-y-3 max-h-[400px] overflow-y-auto">

              {players.map((player) => (

                <div
                  key={player.id}
                  className="bg-slate-700 rounded-lg p-3 flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {player.name}
                    </p>

                    <p className="text-sm text-gray-300">
                      Base Price
                    </p>

                  </div>

                  <div className="font-bold">
                    ₹{player.basePrice}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
    </div>

    {/* SOLD POPUP */}

    {soldPopup && soldData && (

      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

        <div className="bg-green-600 rounded-2xl p-10 text-center shadow-2xl w-[500px]">

          <h1 className="text-5xl font-extrabold mb-6">
            🏏 SOLD
          </h1>

          <p className="text-3xl font-bold">
            {soldData.playerName}
          </p>

          <p className="text-xl mt-4">
            to
          </p>

          <p className="text-3xl font-bold text-yellow-300 mt-2">
            {soldData.teamName}
          </p>

          <p className="text-4xl font-extrabold mt-8">
            ₹{soldData.soldPrice}
          </p>

        </div>

      </div>

    )}

    {/* UNSOLD POPUP */}

{unsoldPopup && unsoldData && (

  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-red-600 rounded-2xl p-10 text-center shadow-2xl w-[500px]">

      <h1 className="text-5xl font-extrabold mb-6">
        ❌ UNSOLD
      </h1>

      <p className="text-3xl font-bold">
        {unsoldData.playerName}
      </p>

      <p className="text-xl mt-4">
        went unsold
      </p>

    </div>

  </div>

)}
  </>
  
);

}

export default Auction;