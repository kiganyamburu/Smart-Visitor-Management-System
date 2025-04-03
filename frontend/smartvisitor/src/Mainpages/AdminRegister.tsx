import { useState } from "react";
import { registerAdmin } from "../apis/authApi";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "ADMIN",
    authorities: [{ authority: "ADMIN" }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await registerAdmin(formData);
      setMessage({ text: "Registration successful!", type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      setMessage({ text: error, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray 100 to-gray-200 px-4">
      <div className="bg-gray-100 shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-gray-800">📝 Admin Registration</h2>

        {message && (
          <div
            className={`mt-4 text-center text-sm p-2 rounded ${
              message.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="w-full mt-1 p-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="w-full mt-1 p-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 p-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 p-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex justify-center"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Register"}
          </button>

          <div className="mt-4 text-center">
            <a href="/" className="text-gray-600 hover:underline">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
