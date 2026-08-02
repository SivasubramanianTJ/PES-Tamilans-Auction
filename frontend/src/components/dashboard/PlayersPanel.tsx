import { useEffect, useState } from "react";

import {
  getAllPlayers,
  deletePlayer,
  updatePlayer,
} from "../../api/players";

function PlayersPanel() {

    const [players, setPlayers] = useState<any[]>([]);
    const [editingId, setEditingId] = useState("");
const [editName, setEditName] = useState("");
const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const res = await getAllPlayers();

    setPlayers(res.data.data);
  }

  async function handleDelete(id: string) {

    if (!confirm("Delete player?")) return;

    await deletePlayer(id);

    loadPlayers();
  }

 function startEdit(player: any) {
  setEditingId(player.id);
  setEditName(player.name);
  setEditPhone(player.phoneNumber);
}

async function saveEdit() {

  await updatePlayer(editingId, {
    name: editName,
    phoneNumber: editPhone,
  });

  setEditingId("");

  loadPlayers();
}

  return (
    <div className="space-y-5">

      <h1 className="text-3xl font-bold">
        Players
      </h1>

      {players.map((player) => (

  <div
    key={player.id}
    className="bg-slate-800 rounded-lg p-4 flex justify-between items-center"
  >

    {editingId === player.id ? (

      <div className="space-y-2">

        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        />

        <input
          value={editPhone}
          onChange={(e) => setEditPhone(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        />

        <button
          onClick={saveEdit}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Save
        </button>

      </div>

    ) : (

      <div>
        <h2 className="font-bold">{player.name}</h2>
        <p>{player.phoneNumber}</p>
      </div>

    )}

    <div className="flex gap-2">

      <button
        onClick={() => startEdit(player)}
        className="bg-yellow-500 px-4 py-2 rounded"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(player.id)}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Delete
      </button>

    </div>

  </div>

))}
    </div>
  );
}

export default PlayersPanel;