import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-green-400">CricLocal</h1>

        <p className="mt-4 text-gray-300 text-lg">
          Local cricket tournament scoring platform for schools, colleges,
          clubs and turf matches.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;