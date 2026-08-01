import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;