import React, { useState, useContext } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import ClipLoader from "react-spinners/ClipLoader";
import { DepartmentContext } from "../../contexts/DepartmentContext";

const PreRegister: React.FC = () => {
  // Get the current department from context
  const { department } = useContext(DepartmentContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idType: "NATIONAL_ID",
    idNumber: "",
    purpose: "",
    gender: "",
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Prepare payload with gender from form and department from context
    const payload = { ...formData, department };

    try {
      const response = await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor",
        payload
      );
      console.log(response.data);
      const visitorId = response.data.visitorId;
      const qrCodeUrl = `https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/${visitorId}`;
      setQrCode(qrCodeUrl);
      setSuccess("Registration successful! QR Code has been sent to your email.");
    } catch (err) {
      setError("Failed to register visitor. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white flex flex-col md:items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-3 mt-3">Visitor Pre-Registration</h1>

      <form onSubmit={handleSubmit} className="w-full md:max-w-2xl p-4 border rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">ID Type</label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="NATIONAL_ID">National ID</option>
              <option value="PASSPORT">Passport</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Purpose of Visit</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Gender Selector */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          {/* Display Department from Context */}
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Department</label>
            <input
              type="text"
              value={department}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded flex justify-center mt-4"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : "Generate QR Code"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}

      {qrCode && (
        <div className="mt-6 text-center flex justify-center items-center flex-col">
          <h2 className="text-lg font-bold">Your QR Code</h2>
          <QRCodeCanvas value={qrCode} size={200} className="mt-4" />
          <p className="text-gray-600 mt-2">
            Scan this QR code at the reception for a smooth check-in.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreRegister;
