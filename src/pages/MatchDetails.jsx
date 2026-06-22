import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  const fetchMatch = async () => {
    const docRef = doc(db, "matches", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMatch(docSnap.data());
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const addRuns = async (runsToAdd) => {
    const docRef = doc(db, "matches", id);

    const newRuns = match.runs + runsToAdd;
    let newBalls = match.balls + 1;
    let newOvers = match.overs;

    if (newBalls === 6) {
      newOvers += 1;
      newBalls = 0;
    }

    await updateDoc(docRef, {
      runs: newRuns,
      overs: newOvers,
      balls: newBalls,
    });

    fetchMatch();
  };

  const addWicket = async () => {
    const docRef = doc(db, "matches", id);

    await updateDoc(docRef, {
      wickets: match.wickets + 1,
    });

    fetchMatch();
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        Loading Match...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-green-400">
        {match.teamA} vs {match.teamB}
      </h1>

      <p className="mt-2 text-gray-300">📍 {match.venue}</p>

      <div className="mt-8 bg-gray-900 p-6 rounded-xl">
        <h2 className="text-5xl font-bold">
          {match.runs}/{match.wickets}
        </h2>

        <p className="text-xl mt-2">
          Overs: {match.overs}.{match.balls}
        </p>

        <p className="mt-4 text-green-400">
          Status: {match.status}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Scoring Panel</h2>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => addRuns(run)}
              className="bg-green-500 text-black p-4 rounded font-bold text-xl"
            >
              {run}
            </button>
          ))}

          <button
            onClick={addWicket}
            className="bg-red-500 text-white p-4 rounded font-bold text-xl col-span-3"
          >
            Wicket
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;