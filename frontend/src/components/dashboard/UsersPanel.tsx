import { useState } from "react";
import { createUser } from "../../api/auth";

function UsersPanel() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CAPTAIN");

  async function handleCreateUser() {
    try {
      await createUser({
        fullName,
        username,
        password,
        role: role as "ADMIN" | "CAPTAIN",
      });

      alert("User created successfully");

      setFullName("");
      setUsername("");
      setPassword("");
      setRole("CAPTAIN");
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8 max-w-xl">

      <h2 className="text-3xl font-bold mb-6">
        User Management
      </h2>

      <div className="space-y-4">

        <input
          className="w-full p-3 rounded bg-slate-700"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-slate-700"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 rounded bg-slate-700"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full p-3 rounded bg-slate-700"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="CAPTAIN">Captain</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          Create User
        </button>

      </div>
    </div>
  );
}

export default UsersPanel;