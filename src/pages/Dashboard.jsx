import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    if (!auth.currentUser) {
      return;
    }

    const q = query(
      collection(db, "tournaments"),
      where("ownerId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTournaments(data);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-green-400">
          Dashboard
        </h1>

        <div className="flex gap-3">
          <Link
            to="/create-tournament"
            className="bg-green-500 text-black px-4 py-2 rounded"
          >
            New Tournament
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <p className="text-gray-400">
          No tournaments found. Create your first tournament.
        </p>
      ) : (
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
      )}
    </div>
  );
}

export default Dashboard;