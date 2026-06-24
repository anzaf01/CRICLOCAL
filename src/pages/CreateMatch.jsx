import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function CreateMatch() {
  const { id } = useParams();

  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const q = query(
        collection(db, "teams"),
        where("tournamentId", "==", id)
      );

      const snapshot = await getDocs(q);

      const teamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTeams(teamData);
    };

    fetchTeams();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (teamA === teamB) {
      alert("Team A and Team B cannot be same");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "matches"), {
        tournamentId: id,
        teamA,
        teamB,
        venue,
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,

        innings: 1,

        firstInningsScore: null,
        target: null,

        battingTeam: teamA,
        bowlingTeam: teamB,

        status: "live",

        history: [],
        createdAt: serverTimestamp(),
      });

      alert("Match created successfully!");

      setTeamA("");
      setTeamB("");
      setVenue("");
    } catch (error) {
      console.error(error);
      alert("Error creating match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Create Match
      </h1>

      {teams.length < 2 ? (
        <div>
          <p className="text-red-400">
            Add at least 2 teams before creating a match.
          </p>

          <Link
            to={`/tournament/${id}/add-team`}
            className="inline-block mt-4 bg-green-500 text-black px-4 py-2 rounded"
          >
            Add Team
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-md bg-gray-900 p-6 rounded-xl"
        >
          <select
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-800"
            required
          >
            <option value="">Select Team A</option>
            {teams.map((team) => (
              <option key={team.id} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </select>

          <select
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-800"
            required
          >
            <option value="">Select Team B</option>
            {teams.map((team) => (
              <option key={team.id} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-800"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded font-semibold"
          >
            {loading ? "Creating..." : "Create Match"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CreateMatch;