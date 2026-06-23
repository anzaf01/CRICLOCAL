import { useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function AddTeam() {
  const { id } = useParams();

  const [teamName, setTeamName] = useState("");
  const [captain, setCaptain] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ================================
      // SAVE TEAM
      // ================================
      await addDoc(collection(db, "teams"), {
        tournamentId: id,
        teamName,
        captain,
      });

      // ================================
      // CREATE POINTS TABLE RECORD
      // ================================
      await addDoc(collection(db, "pointsTable"), {
        tournamentId: id,
        teamName,

        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        noResult: 0,

        points: 0,
      });

      alert("Team Added and Points Table Updated");

      setTeamName("");
      setCaptain("");
    } catch (error) {
      console.error(error);
      alert("Error adding team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Add Team
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-gray-900 p-6 rounded-xl"
      >
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          placeholder="Captain Name"
          value={captain}
          onChange={(e) => setCaptain(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-black p-3 rounded font-semibold"
        >
          {loading ? "Adding..." : "Add Team"}
        </button>
      </form>
    </div>
  );
}

export default AddTeam;