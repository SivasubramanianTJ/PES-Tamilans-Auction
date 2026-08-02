import { useState } from "react";

function AdminAuction() {
  const [selectedPlayer, setSelectedPlayer] = useState("");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Auction Control Panel
      </h1>

      <div className="grid grid-cols-2 gap-8">

        <div className="bg-slate-800 rounded-xl p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Player Queue
          </h2>

          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-3 rounded bg-slate-700"
          >
            <option>Select Player</option>
          </select>

          <button
            className="mt-4 w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg"
          >
            ▶ Start Player
          </button>

        </div>

        <div className="bg-slate-800 rounded-xl p-6">

          <h2 className="text-2xl font-semibold mb-6">
            Current Auction
          </h2>

          <p>Player : -</p>

          <p>Base Price : -</p>

          <p>Highest Bid : -</p>

          <p>Team : -</p>

          <button
            className="mt-6 w-full bg-blue-600 p-3 rounded-lg"
          >
            Sold
          </button>

          <button
            className="mt-3 w-full bg-red-600 p-3 rounded-lg"
          >
            Unsold
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminAuction;