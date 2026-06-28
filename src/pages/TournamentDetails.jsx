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
  const [pointsTable, setPointsTable] = useState([]);

  useEffect(() => {
    const fetchTournament = async () => {
      const docRef = doc(db, "tournaments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTournament(docSnap.data());
      }
    };

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

    const fetchPointsTable = async () => {
      const q = query(
        collection(db, "pointsTable"),
        where("tournamentId", "==", id)
      );

      const snapshot = await getDocs(q);

      const tableData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      tableData.sort((a, b) => {
        if ((b.points || 0) !== (a.points || 0)) {
          return (b.points || 0) - (a.points || 0);
        }

        if ((b.won || 0) !== (a.won || 0)) {
          return (b.won || 0) - (a.won || 0);
        }

        return (a.teamName || "").localeCompare(b.teamName || "");
      });

      setPointsTable(tableData);
    };

    fetchTournament();
    fetchTeams();
    fetchMatches();
    fetchPointsTable();
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

      <div className="mt-8 flex gap-4 flex-wrap">
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
        <h2 className="text-2xl font-bold mb-4">Points Table</h2>

        {pointsTable.length === 0 ? (
          <p className="text-gray-400">No points table available yet.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-900 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3">Pos</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">P</th>
                  <th className="p-3">W</th>
                  <th className="p-3">L</th>
                  <th className="p-3">T</th>
                  <th className="p-3">NR</th>
                  <th className="p-3">NRR</th>
                  <th className="p-3">Pts</th>
                </tr>
              </thead>

              <tbody>
                {pointsTable.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`border-t border-gray-800 ${
                      index === 0 ? "bg-green-900/30" : ""
                    }`}
                  >
                    <td className="p-3 font-bold">{index + 1}</td>
                    <td className="p-3 font-semibold">{team.teamName}</td>
                    <td className="p-3">{team.played || 0}</td>
                    <td className="p-3">{team.won || 0}</td>
                    <td className="p-3">{team.lost || 0}</td>
                    <td className="p-3">{team.tied || 0}</td>
                    <td className="p-3">{team.noResult || 0}</td>
                    <td className="p-3">
                      {typeof team.nrr === "number"
                        ? team.nrr.toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="p-3 text-green-400 font-bold">
                      {team.points || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Upcoming / Live Matches</h2>

        {matches.filter((match) => match.status !== "completed").length ===
        0 ? (
          <p className="text-gray-400">No upcoming or live matches.</p>
        ) : (
          <div className="grid gap-3">
            {matches
              .filter((match) => match.status !== "completed")
              .map((match) => (
                <Link
                  to={`/match/${match.id}`}
                  key={match.id}
                  className="bg-gray-900 p-4 rounded block hover:bg-gray-800"
                >
                  <h3 className="font-semibold">
                    {match.teamA} vs {match.teamB}
                  </h3>

                  <p className="text-gray-300">Venue: {match.venue}</p>

                  <p className="text-yellow-400">Status: {match.status}</p>
                </Link>
              ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Completed Results</h2>

        {matches.filter((match) => match.status === "completed").length ===
        0 ? (
          <p className="text-gray-400">No completed matches yet.</p>
        ) : (
          <div className="grid gap-3">
            {matches
              .filter((match) => match.status === "completed")
              .map((match) => (
                <Link
                  to={`/match/${match.id}`}
                  key={match.id}
                  className="bg-gray-900 p-4 rounded block hover:bg-gray-800"
                >
                  <h3 className="font-semibold">
                    {match.teamA} vs {match.teamB}
                  </h3>

                  <p className="text-gray-300">Venue: {match.venue}</p>

                  <p className="text-green-400 font-semibold">
                    Winner: {match.winner || "Result not available"}
                  </p>

                  <p className="text-gray-300">
                    Final Score: {match.runs}/{match.wickets} ({match.overs}.
                    {match.balls})
                  </p>
                </Link>
              ))}
          </div>
        )}
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
    </div>
  );
}

export default TournamentDetails;