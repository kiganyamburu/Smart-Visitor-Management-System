import { useState } from "react";
import { loginAdmin } from "../apis/authApi";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import logo from "../assets/smlogo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await loginAdmin(email, password);
      setMessage({ text: "Login successful!", type: "success" });
      localStorage.setItem("token", response.token);
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error: any) {
      setMessage({ text: "Invalid credentials. Please try again.", type: "error" });
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side (Branding Section) */}
      <div className="hidden md:flex md:w-1/2 bg-teal-700 flex-col justify-center items-center text-white p-6 animate-fade-in">
        <img
          src={logo}
          alt="Logo"
          className="w-42 mb-2 animate-zoom-in"
        />

        <h1 className="text-3xl font-bold text-center animate-slide-up">
          Welcome to Smart Visitor System
        </h1>

        <p className="text-lg mt-3 text-center px-6 animate-fade-in delay-100">
          Manage your visitors efficiently and securely.
        </p>
      </div>


      {/* Right Side (Login Form) */}
      <div className="w-full md:w-2/3 flex justify-center items-center p-6 md:p-8">
        <div className="bg-gray-100 shadow-2xl rounded-lg p-6 md:p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-teal-700 text-center">Admin Login</h2>
          <p className="text-gray-600 text-sm text-center mb-4">Enter your credentials to continue.</p>

          {message && (
            <div
              className={`text-sm p-2 rounded ${message.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                }`}
            >
              {message.text}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 text-sm">Username:</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-teal-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm">Password:</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-teal-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 p-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition flex justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Log In"}
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            <a href="/forgot-password" className="text-teal-500 hover:underline">
              Forgot Username? | 
            </a>
            <a href="/register" className="ml-2 text-teal-500 hover:underline">
              Register?
            </a>
          </div>

          <footer className="mt-6 text-xs text-gray-500 text-center">
            <p>
              Powered by <span className="text-teal-600">Smart Visitor System</span>
            </p>
            <p className="mt-1">
              <a href="/terms" className="hover:underline">Terms of Use</a> |{" "}
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
