import Auction from "../Auction/Auction";
import { useState } from "react";

import UsersPanel from "../../components/dashboard/UsersPanel";
import PlayersPanel from "../../components/dashboard/PlayersPanel";
import TeamsPanel from "../../components/dashboard/TeamsPanel";
import RetentionPanel from "../../components/dashboard/RetentionPanel";
import AdminControls from "../../components/dashboard/AdminControls";
import MyTeamPanel from "../../components/dashboard/MyTeamPanel";
import TeamManagementPanel from "../../components/dashboard/TeamManagementPanel";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [page, setPage] = useState("dashboard");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6">

        <h1 className="text-2xl font-bold mb-8">
          🏏 PES TAMILANS
        </h1>

        <div className="space-y-3">

          <button
  onClick={() => setPage("dashboard")}
  className="w-full text-left hover:text-yellow-400"
>
  Dashboard
</button>

{user.role === "SUPER_ADMIN" && (
  <button
    onClick={() => setPage("users")}
    className="w-full text-left hover:text-yellow-400"
  >
    Users
  </button>
)}

{user.role !== "CAPTAIN" && (
  <button
    onClick={() => setPage("players")}
    className="w-full text-left hover:text-yellow-400"
  >
    Players
  </button>
)}

<button
  onClick={() => setPage("teams")}
  className="w-full text-left hover:text-yellow-400"
>
  Teams
</button>
{user.role !== "CAPTAIN" && (
  <button
    onClick={() => setPage("auction")}
    className="w-full text-left hover:text-yellow-400"
  >
    Auction
  </button>
)}

{user.role !== "CAPTAIN" && (
  <button
    onClick={() => setPage("retention")}
    className="w-full text-left hover:text-yellow-400"
  >
    Retention
  </button>
)}

{user.role === "CAPTAIN" && (
  <button
    onClick={() => setPage("myteam")}
    className="w-full text-left hover:text-yellow-400"
  >
    My Team
  </button>
)}

{user.role !== "CAPTAIN" && (
<button
  onClick={() => setPage("team-management")}
  className="w-full text-left hover:text-yellow-400"
>
  Team Management
</button>)}

        </div>

      </aside>

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="bg-slate-800 flex justify-between items-center px-8 py-4">

          <div>
            <h2 className="text-xl font-bold">
              Welcome, {user.fullName}
            </h2>

            <p className="text-gray-400">
              {user.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

        {/* Body */}
        <div className="p-8">
            <div className="p-8">
  {page === "dashboard" && <Auction />}
  {page === "users" && <UsersPanel />}
  {page === "players" && <PlayersPanel />}
  {page === "teams" && <TeamsPanel />}
  {page === "auction" && <AdminControls />}
  {page === "retention" && <RetentionPanel />}
  {page === "myteam" && <MyTeamPanel />}
  {page === "team-management" && <TeamManagementPanel />}
</div>



        </div>

      </div>

    </div>
  );
}

export default Dashboard;