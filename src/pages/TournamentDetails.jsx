import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

function TournamentDetails() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchTournament = async () => {
      const docRef = doc(db, "tournaments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTournament(docSnap.data());
      }
    };

    const fetchTeams = async () => {
      const q = query(collection(db, "teams"), where("tournamentId", "==", id));
      const snapshot = await getDocs(q);

      const teamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTeams(teamData);
    };

    const fetchMatches = async () => {
      const q = query(
        collection(db, "matches"),
        where("tournamentId", "==", id)
      );

      const snapshot = await getDocs(q);

      const matchData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMatches(matchData);
    };

    fetchTournament();
    fetchTeams();
    fetchMatches();
  }, [id]);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading tournament...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400">
        {tournament.tournamentName}
      </h1>

      <p className="mt-2">📍 {tournament.location}</p>
      <p>🏏 {tournament.overs} Overs</p>

      <div className="mt-8 flex gap-4">
        <Link
          to={`/tournament/${id}/add-team`}
          className="bg-green-500 text-black px-4 py-2 rounded font-semibold"
        >
          Add Team
        </Link>

        <Link
          to={`/tournament/${id}/create-match`}
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
        >
          Create Match
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Teams</h2>

        {teams.length === 0 ? (
          <p className="text-gray-400">No teams added yet.</p>
        ) : (
          <div className="grid gap-3">
            {teams.map((team) => (
              <div key={team.id} className="bg-gray-900 p-4 rounded">
                <h3 className="font-semibold">{team.teamName}</h3>
                <p className="text-gray-300">Captain: {team.captain}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Matches</h2>

        {matches.length === 0 ? (
          <p className="text-gray-400">No matches created yet.</p>
        ) : (
          <div className="grid gap-3">
            {matches.map((match) => (
              <Link
                to={`/match/${match.id}`}
                key={match.id}
                className="bg-gray-900 p-4 rounded block hover:bg-gray-800"
              >
                <h3 className="font-semibold">
                  {match.teamA} vs {match.teamB}
                </h3>

                <p className="text-gray-300">Venue: {match.venue}</p>
                <p className="text-green-400">
                  Score: {match.runs}/{match.wickets} ({match.overs}.{match.balls})
                </p>
                <p>Status: {match.status}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TournamentDetails;