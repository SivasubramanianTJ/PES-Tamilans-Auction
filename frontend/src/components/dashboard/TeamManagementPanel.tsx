import { useEffect, useState } from "react";
import {
  getTeams,
  createTeam,
  getAvailableCaptains,
  assignCaptain,
  deleteTeam,
} from "../../api/team";

function TeamManagementPanel() {
  const [teams, setTeams] = useState<any[]>([]);
  const [captains, setCaptains] = useState<any[]>([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const teamsRes = await getTeams();
    const captainsRes = await getAvailableCaptains();

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

  async function handleAssign(
    teamId: string,
    captainUserId: string
  ) {
    if (!captainUserId) return;

    await assignCaptain(teamId, captainUserId);

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
          className="bg-slate-800 rounded px-3 py-2 w-72"
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 px-5 rounded"
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

            <div className="flex items-center gap-3">
              {!team.captain && (
                <select
                  defaultValue=""
                  onChange={(e) =>
                    handleAssign(team.id, e.target.value)
                  }
                  className="bg-slate-700 rounded px-2 py-2"
                >
                  <option value="">
                    Assign Captain
                  </option>

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

              <button
                onClick={() => handleDelete(team.id)}
                className="bg-red-600 px-4 py-2 rounded"
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

export default TeamManagementPanel;