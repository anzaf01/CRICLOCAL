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
    if (!auth.currentUser) return;

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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold text-green-400">
              Organizer Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Welcome, {auth.currentUser?.email}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/create-tournament"
              className="bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400"
            >
              New Tournament
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900 p-5 rounded-xl">
            <p className="text-gray-400">Total Tournaments</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {tournaments.length}
            </h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl">
            <p className="text-gray-400">Organizer</p>
            <h2 className="text-lg font-semibold mt-2 break-all">
              {auth.currentUser?.email}
            </h2>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl">
            <p className="text-gray-400">Status</p>
            <h2 className="text-2xl font-bold text-blue-400 mt-2">
              Active
            </h2>
          </div>
        </div>

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Your Tournaments</h2>
        </div>

        {tournaments.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <p className="text-gray-400 mb-4">
              No tournaments found. Create your first tournament.
            </p>

            <Link
              to="/create-tournament"
              className="inline-block bg-green-500 text-black px-5 py-3 rounded font-semibold"
            >
              Create Tournament
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
              <Link
                to={`/tournament/${tournament.id}`}
                key={tournament.id}
                className="bg-gray-900 p-5 rounded-xl block hover:bg-gray-800 transition"
              >
                <h2 className="text-xl font-semibold text-green-400">
                  {tournament.tournamentName}
                </h2>

                <p className="text-gray-300 mt-3">
                  📍 {tournament.location}
                </p>

                <p className="text-gray-300 mt-1">
                  🏏 {tournament.overs} Overs
                </p>

                <p className="text-gray-500 mt-4 text-sm">
                  Click to manage tournament
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;