
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const querySnapshot = await getDocs(
      collection(db, "tournaments")
    );

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTournaments(data);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400">
          Dashboard
        </h1>

        <Link
          to="/create-tournament"
          className="bg-green-500 text-black px-4 py-2 rounded"
        >
          New Tournament
        </Link>
      </div>

     <div className="grid gap-4">
  {tournaments.map((tournament) => (
    <Link
      to={`/tournament/${tournament.id}`}
      key={tournament.id}
      className="bg-gray-900 p-4 rounded-lg block hover:bg-gray-800"
    >
      <h2 className="text-xl font-semibold">
        {tournament.tournamentName}
      </h2>

      <p>📍 {tournament.location}</p>

      <p>🏏 {tournament.overs} Overs</p>
    </Link>
  ))}
</div>
    </div>
  );
}

export default Dashboard;