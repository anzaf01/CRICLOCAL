import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <form onSubmit={handleRegister} className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-500 text-black p-3 rounded font-semibold" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="mt-4 text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
