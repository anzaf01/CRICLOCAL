import { useEffect, useState } from "react";
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

function TeamDetails() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      const teamRef = doc(db, "teams", teamId);
      const teamSnap = await getDoc(teamRef);

      if (teamSnap.exists()) {
        const teamData = {
          id: teamSnap.id,
          ...teamSnap.data(),
        };

        setTeam(teamData);

        const tournamentRef = doc(db, "tournaments", teamData.tournamentId);
        const tournamentSnap = await getDoc(tournamentRef);

        if (tournamentSnap.exists()) {
          setTournament(tournamentSnap.data());
        }

        const q = query(
          collection(db, "players"),
          where("teamId", "==", teamId)
        );

        const snapshot = await getDocs(q);

        const playerData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlayers(playerData);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading team...
      </div>
    );
  }

  const maxPlayers = tournament?.maxPlayers || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400">
        {team.teamName}
      </h1>

      <p className="mt-2 text-gray-300">
        Captain: {team.captain}
      </p>

      <p className="mt-2 text-gray-400">
        Players: {players.length}/{maxPlayers || "Not set"}
      </p>

      <div className="mt-6">
        {players.length < maxPlayers && (
          <Link
            to={`/team/${teamId}/add-player`}
            className="bg-green-500 text-black px-4 py-2 rounded font-semibold"
          >
            Add Player
          </Link>
        )}

        {maxPlayers && players.length >= maxPlayers && (
          <p className="text-red-400 font-semibold">
            Maximum player limit reached.
          </p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Players</h2>

        {players.length === 0 ? (
          <p className="text-gray-400">No players added yet.</p>
        ) : (
          <div className="grid gap-3">
            {players.map((player) => (
              <div key={player.id} className="bg-gray-900 p-4 rounded">
                <h3 className="font-semibold">
                  #{player.jerseyNumber} {player.playerName}
                </h3>

                <p className="text-gray-300">Role: {player.role}</p>

                {player.isCaptain && (
                  <p className="text-green-400">Captain</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamDetails;
