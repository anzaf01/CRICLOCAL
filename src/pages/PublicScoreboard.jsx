import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function PublicScoreboard() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const docRef = doc(db, "matches", id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMatch(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading Scoreboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold text-green-400 text-center">
          CricLocal Live Score
        </h1>

        <div className="mt-8 bg-gray-900 p-6 rounded-xl text-center">
          <h2 className="text-2xl font-bold">
            {match.teamA} vs {match.teamB}
          </h2>

          <p className="mt-2 text-gray-300">📍 {match.venue}</p>

          <h3 className="text-6xl font-bold mt-8">
            {match.runs}/{match.wickets}
          </h3>

          <p className="text-2xl mt-3">
            Overs: {match.overs}.{match.balls}
          </p>

          <p className="mt-4 text-green-400 font-semibold">
            Status: {match.status}
          </p>

          {match.winner && (
            <p className="mt-2 text-purple-400 font-semibold">
              Winner: {match.winner}
            </p>
          )}
        </div>

        <div className="mt-6 bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Ball History</h2>

          {match.history && match.history.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {match.history.map((ball, index) => (
                <span
                  key={index}
                  className="bg-gray-800 px-3 py-2 rounded font-semibold"
                >
                  {ball.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No balls yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicScoreboard;