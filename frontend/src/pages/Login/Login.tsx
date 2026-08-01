import { useState } from "react";
import { login } from "../../api/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

async function handleLogin() {
  try {
    const response = await login(username, password);

    console.log("LOGIN RESPONSE:", response);
    const token = response.data.data.token;

console.log("TOKEN:", token);

const user = response.data.data.user;

localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

console.log("STORED:", localStorage.getItem("token"));

    console.log("STORED:", localStorage.getItem("token"));

    alert("Login Successful!");

    window.location.href = "/";
  } catch (error: any) {
    console.error(error);
    console.error(error.response?.data);

    alert(error.response?.data?.error || error.message);
  }
}

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-xl w-96">

        <h1 className="text-white text-3xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          className="w-full p-3 rounded mb-4"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-3 rounded mb-6"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full p-3 rounded"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;