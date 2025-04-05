import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { DepartmentContext } from "../../contexts/DepartmentContext";

interface GuestCheckInData {
  id: string;
  name: string;
  email: string;
  phone: string;
  idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE";
  idNumber: string;
  imageUrl?: string;
  qrCode: string;
  checkInTime: string;
  checkOutTime: string;
  status: "CHECKED_IN";
  role: "GUEST";
  gender: string;
  department: string;
}

const GuestCheckIn: React.FC = () => {
  // Get department from context
  const { department } = useContext(DepartmentContext);

  const initialData: GuestCheckInData = {
    id: "",
    name: "",
    email: "",
    phone: "",
    idType: "NATIONAL_ID",
    idNumber: "",
    qrCode: "",
    checkInTime: new Date().toISOString(),
    checkOutTime: "",
    status: "CHECKED_IN",
    role: "GUEST",
    gender: "",
    department: department, // initialize with the context value
  };

  const [formData, setFormData] = useState<GuestCheckInData>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle Form Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setMessage("❌ Camera access denied. Please allow camera permissions.");
    }
  };

  // Capture Image and Stop Camera
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Draw the video frame onto the canvas
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        // Convert canvas image to data URL
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        // Update formData with captured image
        setFormData({ ...formData, imageUrl: imageData });
        stopCamera();
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Cleanup Camera on Unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Ensure department is always up-to-date from context
      const payload = { ...formData, department };
      const response = await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/guest-checkin",
        payload
      );
      setMessage(`✅ ${formData.name} has been checked in successfully!`);
      // Reset the form; preserve the department from context.
      setFormData({ ...initialData, department });
      setCapturedImage(null);
      console.log(response);
    } catch (error) {
      console.error("Guest Check-in Failed:", error);
      setMessage("❌ Error checking in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 md:p-6 p-2 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        🛂 Guest Check-In
      </h2>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center border ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Check-in Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-2 border rounded-md"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded-md"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full p-2 border rounded-md"
        />

        <select
          name="idType"
          value={formData.idType}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="NATIONAL_ID">National ID</option>
          <option value="PASSPORT">Passport</option>
          <option value="DRIVER_LICENSE">Driver's License</option>
        </select>

        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          placeholder="ID Number"
          required
          className="w-full p-2 border rounded-md"
        />

        {/* Gender Selector and Department Display */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
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
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Photo Capture Section */}
        {cameraActive ? (
          <div className="flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              className="w-64 h-48 border rounded-md"
            ></video>
            <button
              type="button"
              onClick={capturePhoto}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              📸 Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              ❌ Stop Camera
            </button>
          </div>
        ) : (
          <>
            {capturedImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-64 h-48 border rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCapturedImage(null);
                    // Clear the image from formData as well
                    setFormData({ ...formData, imageUrl: "" });
                    startCamera();
                  }}
                  className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
                >
                  🔄 Retake Photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-800 transition"
              >
                📷 Open Camera
              </button>
            )}
          </>
        )}

        {/* Hidden Canvas for Image Processing */}
        <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>

        {/* Loading State */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : "Check In"}
        </button>
      </form>
    </div>
  );
};

export default GuestCheckIn;
