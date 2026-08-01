import { useEffect, useState } from "react";
import api from "../../api/axios";

function MyTeamPanel() {
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    const res = await api.get("/teams/my-team");
    setTeam(res.data.data);
  }

  if (!team) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6">

      <div className="flex items-center gap-4 mb-6">

        <img
          src={team.logoUrl}
          className="w-20 h-20 rounded-full bg-white"
        />

        <div>
          <h2 className="text-3xl font-bold">
            {team.name}
          </h2>

          <p>
            Remaining Budget:
            ₹{team.remainingBudget.toLocaleString()}
          </p>
        </div>

      </div>

      <h3 className="text-2xl font-bold mb-4">
        Squad
      </h3>

      <div className="space-y-3">

        {team.players.map((player: any) => (

          <div
            key={player.id}
            className="bg-slate-700 rounded-lg p-4 flex justify-between"
          >
            <span>{player.name}</span>

            <span>
              ₹{player.soldPrice}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyTeamPanel;