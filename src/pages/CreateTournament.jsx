import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";

function CreateTournament() {
  const [tournamentName, setTournamentName] = useState("");
  const [location, setLocation] = useState("");
  const [overs, setOvers] = useState("");

  const [winPoints, setWinPoints] = useState(2);
  const [lossPoints, setLossPoints] = useState(0);
  const [tiePoints, setTiePoints] = useState(1);
  const [noResultPoints, setNoResultPoints] = useState(1);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addDoc(collection(db, "tournaments"), {
        tournamentName,
        location,
        overs: Number(overs),

         ownerId: auth.currentUser.uid,
         ownerEmail: auth.currentUser.email,

        pointsRules: {
          win: Number(winPoints),
          loss: Number(lossPoints),
          tie: Number(tiePoints),
          noResult: Number(noResultPoints),
        },

        createdAt: serverTimestamp(),
      });

      alert("Tournament saved successfully!");

      setTournamentName("");
      setLocation("");
      setOvers("");
      setWinPoints(2);
      setLossPoints(0);
      setTiePoints(1);
      setNoResultPoints(1);
    } catch (error) {
      console.error(error);
      alert("Error saving tournament");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Create Tournament
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-gray-900 p-6 rounded-xl"
      >
        <input
          type="text"
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <input
          type="number"
          placeholder="Overs"
          value={overs}
          onChange={(e) => setOvers(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <h2 className="text-xl font-bold text-green-400 mt-6 mb-4">
          Points Rules
        </h2>

        <input
          type="number"
          placeholder="Points for Win"
          value={winPoints}
          onChange={(e) => setWinPoints(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <input
          type="number"
          placeholder="Points for Loss"
          value={lossPoints}
          onChange={(e) => setLossPoints(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <input
          type="number"
          placeholder="Points for Tie"
          value={tiePoints}
          onChange={(e) => setTiePoints(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <input
          type="number"
          placeholder="Points for No Result"
          value={noResultPoints}
          onChange={(e) => setNoResultPoints(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-black p-3 rounded font-semibold"
        >
          {loading ? "Saving..." : "Create Tournament"}
        </button>
      </form>
    </div>
  );
}

export default CreateTournament;