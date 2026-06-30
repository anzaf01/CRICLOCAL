import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import TournamentDetails from "./pages/TournamentDetails";
import AddTeam from "./pages/AddTeam";
import CreateMatch from "./pages/CreateMatch";
import MatchDetails from "./pages/MatchDetails";
import PublicScoreboard from "./pages/PublicScoreboard";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import TeamDetails from "./pages/TeamDetails";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/public/:id" element={<PublicScoreboard />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-tournament"
        element={
          <ProtectedRoute>
            <CreateTournament />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tournament/:id"
        element={
          <ProtectedRoute>
            <TournamentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tournament/:id/add-team"
        element={
          <ProtectedRoute>
            <AddTeam />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tournament/:id/create-match"
        element={
          <ProtectedRoute>
            <CreateMatch />
          </ProtectedRoute>
        }
      />

      <Route
        path="/match/:id"
        element={
          <ProtectedRoute>
            <MatchDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;