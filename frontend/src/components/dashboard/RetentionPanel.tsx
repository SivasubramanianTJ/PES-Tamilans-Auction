import { useEffect, useState } from "react";
import { getLiveTeams, getRemainingPlayers, assignRetention } from "../../api/auction";

function RetentionPanel() {
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [teamId, setTeamId] = useState("");
  const [seasonPlayerId, setSeasonPlayerId] = useState("");
  const [soldPrice, setSoldPrice] = useState("");

  useEffect(() => {
    loadTeams();
    loadPlayers();
  }, []);

  async function loadTeams() {
    const response = await getLiveTeams();
    setTeams(response.data.data);
    
  }

  async function loadPlayers() {
    const response = await getRemainingPlayers();
    setPlayers(response.data.data);
  }

  async function handleRetention() {
    try {
      await assignRetention({
        teamId,
        seasonPlayerId,
        soldPrice: Number(soldPrice),
      });

      alert("Retention completed successfully");

      loadPlayers();
      loadTeams();

      setTeamId("");
      setSeasonPlayerId("");
      setSoldPrice("");

    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8 max-w-xl">

      <h1 className="text-3xl font-bold mb-6">
        Player Retention
      </h1>

      <div className="space-y-4">

        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="w-full p-3 rounded bg-slate-700"
        >
          <option value="">Select Team</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          value={seasonPlayerId}
          onChange={(e) => setSeasonPlayerId(e.target.value)}
          className="w-full p-3 rounded bg-slate-700"
        >
          <option value="">Select Player</option>

          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Retention Price"
          value={soldPrice}
          onChange={(e) => setSoldPrice(e.target.value)}
          className="w-full p-3 rounded bg-slate-700"
        />

        <button
          onClick={handleRetention}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-semibold"
        >
          Assign Retention
        </button>

      </div>

    </div>
  );
}

export default RetentionPanel;