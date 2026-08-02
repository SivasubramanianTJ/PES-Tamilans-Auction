import { useEffect, useState } from "react";

import {
  createTeam,
  getAllTeams,
  getAvailableCaptains,
  assignCaptain,
  removeCaptain,
  deleteTeam,
} from "../../api/team";

function TeamsPanel() {
  const [teams, setTeams] = useState<any[]>([]);
  const [captains, setCaptains] = useState<any[]>([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  const [teamsRes, captainsRes] = await Promise.all([
    getAllTeams(),
    getAvailableCaptains(),
  ]);

  console.log(teamsRes.data.data);
  console.log(captainsRes.data.data);

  setTeams(teamsRes.data.data);
  setCaptains(captainsRes.data.data);
}

  async function handleCreate() {
    if (!teamName.trim()) return;

    await createTeam({
      name: teamName,
    });

    setTeamName("");
    loadData();
  }

  async function handleAssign(teamId: string, captainId: string) {
    if (!captainId) return;

    await assignCaptain({
  teamId,
  captainUserId: captainId,
});


    loadData();
  }

async function handleRemoveCaptain(teamId: string) {

  if (!confirm("Remove this captain?")) return;

  await removeCaptain(teamId);

  loadData();
}


  async function handleDelete(teamId: string) {
    if (!confirm("Delete this team?")) return;

    await deleteTeam(teamId);

    loadData();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Team Management
      </h1>

      <div className="flex gap-3">
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team name"
          className="bg-slate-800 p-2 rounded w-72"
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 px-4 rounded"
        >
          Create Team
        </button>
      </div>

      <div className="space-y-4">

        {teams.map((team) => (

          <div
            key={team.id}
            className="bg-slate-800 rounded-lg p-5 flex justify-between items-center"
          >

            <div>

              <h2 className="text-xl font-bold">
                {team.name}
              </h2>

              <p className="text-gray-400">
                Captain :
                {team.captain
                  ? ` ${team.captain.fullName}`
                  : " Not Assigned"}
              </p>

            </div>

            <div className="flex gap-3">

              {!team.captain && (
  <select
    defaultValue=""
    onChange={(e) => handleAssign(team.id, e.target.value)}
    className="bg-slate-700 p-2 rounded"
  >
    <option value="">Assign Captain</option>

    {captains.map((captain) => (
      <option
        key={captain.id}
        value={captain.id}
      >
        {captain.fullName}
      </option>
    ))}
  </select>
)}

{team.captain && (
  <button
    onClick={() => handleRemoveCaptain(team.id)}
    className="bg-orange-600 px-4 rounded"
  >
    Remove Captain
  </button>
)}

<button
  onClick={() => handleDelete(team.id)}
  className="bg-red-600 px-4 rounded"
>
  Delete
</button>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}

export default TeamsPanel;