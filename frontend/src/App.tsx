import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Live from "./pages/Live/Live";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Dashboard /> : <Login />}
      />

      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Login />}
      />

      <Route
  path="/live"
  element={<Live />}
/>
    </Routes>
    
  );
}

export default App;