import { useState } from "react";

function PlayersPanel() {
  const [file, setFile] = useState<File | null>(null);

  async function uploadPlayers() {
    if (!file) {
      alert("Select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:4000/api/players/import",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    alert(data.message);
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8 max-w-xl">

      <h1 className="text-3xl font-bold mb-6">
        Import Players
      </h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />

      <button
        onClick={uploadPlayers}
        className="mt-6 bg-green-600 px-6 py-3 rounded-lg"
      >
        Upload Excel
      </button>

    </div>
  );
}

export default PlayersPanel;