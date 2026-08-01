import { useEffect, useState } from "react";

function TeamsPanel() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:4000/api/analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    setTeams(data.data.teams);
  }

  return (
    <div className="space-y-4">

      <h1 className="text-3xl font-bold mb-6">
        Team Overview
      </h1>

      {teams.map((team) => (

        <div
          key={team.id}
          className="bg-slate-800 rounded-xl p-6"
        >

          <div className="flex justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                {team.name}
              </h2>

              <p className="text-gray-400">
                Captain: {team.captain ?? "Not Assigned"}
              </p>

            </div>

            <div className="text-right">

              <p>
                💰 Remaining Budget
              </p>

              <h2 className="text-xl font-bold text-green-400">
                ₹{team.remainingBudget}
              </h2>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">

            <div className="bg-slate-700 rounded-lg p-4">

              <p className="text-gray-400">
                Squad
              </p>

              <h2 className="text-2xl font-bold">
                {team.squadSize}
              </h2>

            </div>

            <div className="bg-slate-700 rounded-lg p-4">

              <p className="text-gray-400">
                Retentions
              </p>

              <h2 className="text-2xl font-bold">
                {team.retentions}
              </h2>

            </div>

            <div className="bg-slate-700 rounded-lg p-4">

              <p className="text-gray-400">
                Auction Buys
              </p>

              <h2 className="text-2xl font-bold">
                {team.auctionPlayers}
              </h2>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default TeamsPanel;