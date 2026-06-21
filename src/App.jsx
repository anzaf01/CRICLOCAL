import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import TournamentDetails from "./pages/TournamentDetails";
import AddTeam from "./pages/AddTeam";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-tournament" element={<CreateTournament />} />
      <Route path="/tournament/:id" element={<TournamentDetails />} />
      <Route path="/tournament/:id/add-team" element={<AddTeam />} />
    </Routes>
  );
}

export default App;