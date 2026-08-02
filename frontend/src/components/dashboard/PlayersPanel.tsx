import { useEffect, useState } from "react";

import {
  getAllPlayers,
  deletePlayer,
  updatePlayer,
  importPlayers,
} from "../../api/players";

function PlayersPanel() {

    const [players, setPlayers] = useState<any[]>([]);
    const [editingId, setEditingId] = useState("");
const [editName, setEditName] = useState("");
const [editPhone, setEditPhone] = useState("");
const [excelFile, setExcelFile] = useState<File | null>(null);

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

async function handleUpload() {
  if (!excelFile) {
    alert("Choose an Excel file");
    return;
  }

  const formData = new FormData();
  formData.append("file", excelFile);

  await importPlayers(formData);

  setExcelFile(null);

  loadPlayers();

  alert("Players imported successfully");
}

  return (
    <div className="space-y-5">

      <h1 className="text-3xl font-bold">
        Players
      </h1>

      <div className="bg-slate-800 rounded-lg p-6 flex items-center gap-5">

  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={(e) =>
      setExcelFile(e.target.files?.[0] ?? null)
    }
  />

  <button
    onClick={handleUpload}
    className="bg-green-600 px-5 py-2 rounded"
  >
    Upload Excel
  </button>

</div>
      

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