import React, { useState, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { DepartmentContext } from "../../contexts/DepartmentContext";

interface CheckInData {
  name: string;
  email: string;
  phone: string;
  idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE";
  idNumber: string;
  imageUrl?: string;
  checkInTime: string;
  status: "CHECKED_IN";
  hostId: string;
  gender: string;
  department: string;
}

const ManualCheckIn: React.FC = () => {
  // Get department from context
  const { department } = useContext(DepartmentContext);

  const initialData: CheckInData = {
    name: "",
    email: "",
    phone: "",
    idType: "NATIONAL_ID",
    idNumber: "",
    checkInTime: new Date().toISOString(),
    status: "CHECKED_IN",
    hostId: "",
    gender: "",
    department: department, // initialize with context value
  };

  const [formData, setFormData] = useState<CheckInData>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Full Name is required.";
    if (!formData.email.includes("@")) return "A valid Email is required.";
    if (!formData.phone.trim()) return "Phone Number is required.";
    if (!formData.idNumber.trim()) return "ID Number is required.";
    if (!formData.gender) return "Please select a gender.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const errorMessage = validateForm();
    if (errorMessage) {
      setMessage(`❌ ${errorMessage}`);
      return;
    }

    setLoading(true);
    try {
      // Ensure department is always up-to-date from context
      const payload = { ...formData, department };
      await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/manual-checkin",
        payload
      );
      setMessage(`✅ ${formData.name} has been checked in successfully!`);
      setFormData({ ...initialData, department }); // reset while preserving department
    } catch (error) {
      console.error("Check-in failed:", error);
      setMessage("❌ Error checking in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full bg-white shadow-2xl rounded-xl border border-gray-200 md:p-8 p-2">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📝 Manual Check-In
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-center border ${
              message.includes("✅")
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name, Email, Phone */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* ID Type and ID Number */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <select
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="NATIONAL_ID">National ID</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVER_LICENSE">Driver's License</option>
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="ID Number"
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Gender Selector and Department Display */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="department"
                value={department}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Check In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualCheckIn;
