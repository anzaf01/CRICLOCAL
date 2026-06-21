import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

function TournamentDetails() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      const docRef = doc(db, "tournaments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTournament(docSnap.data());
      }
    };

    fetchTournament();
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
    </div>
  );
}

export default TournamentDetails;