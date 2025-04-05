import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { DepartmentContext } from "../../contexts/DepartmentContext"; // Adjust path as needed

const StaffCheckIn: React.FC = () => {
  // Get the department from context
  const { department: contextDepartment } = useContext(DepartmentContext);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idType, setIdType] = useState("NATIONAL_ID");
  const [idNumber, setIdNumber] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Camera refs and state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 200);
        const capturedImage = canvasRef.current.toDataURL("image/png");
        setImage(capturedImage);
        stopCamera();
        setCameraActive(false);
      }
    }
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
      setCameraActive(false);
    } else {
      setImage(null);
      setCameraActive(true);
    }
  };

  const handleSubmit = async () => {
    // Ensure all fields are provided
    if (!fullName || !email || !phoneNumber || !idNumber || !gender || !image) {
      setModalMessage("⚠️ Please fill all fields, select gender, and take a photo.");
      setModalVisible(true);
      return;
    }

    const staffData = {
      name: fullName,
      email,
      phoneNumber,
      idType,
      idNumber,
      gender,
      // Using the department from context
      department: contextDepartment,
      imageUrl: image,
      checkInTime: new Date().toISOString(),
      status: "CHECKED_IN",
    };

    try {
      setLoading(true);
      // Replace with your actual backend endpoint.
      const response = await axios.post(
        "https://5cdf-102-213-241-210.ngrok-free.app/api/v1/staff",
        staffData
      );
      console.log("staff data",staffData)
      setModalMessage(`✅ ${response.data.message || "Check-in successful! Welcome."}`);
      // Reset fields
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setIdNumber("");
      setIdType("NATIONAL_ID");
      setGender("");
      setImage(null);
      setCameraActive(false);
    } catch (error: any) {
      console.error("Error during staff check-in:", error);
      setModalMessage("❌ Check-in failed. Please try again.");
    } finally {
      setLoading(false);
      setModalVisible(true);
      setImage(null);
      setCameraActive(false);
    }
  };

  return (
    <div className="flex flex-col md:p-6 p-2">
      <div className="w-full max-w-2xl bg-white bg-opacity-30 backdrop-blur-md rounded-xl shadow-2xl md:p-8 p-3">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🛂 Staff Check-In</h2>
        {/* Input Fields */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="NATIONAL_ID">National ID</option>
          <option value="PASSPORT">Passport</option>
          <option value="DRIVER_LICENSE">Driver's License</option>
        </select>
        <input
          type="text"
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          className="w-full p-3 mb-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {/* Gender Selector */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-3 mb-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        {/* Department (Read-Only from Context) */}
        <div className="w-full p-3 mb-5 border border-gray-300 rounded bg-gray-100 text-gray-700">
          Department: <span className="font-semibold">{contextDepartment}</span>
        </div>

        {/* Camera & Image Capture */}
        <div className="flex flex-col items-center">
          {!cameraActive && !image && (
            <button
              onClick={toggleCamera}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105"
            >
              📸 Open Camera
            </button>
          )}
          {cameraActive && (
            <>
              <div className="relative border-4 border-green-500 rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay className="w-72 h-48 object-cover"></video>
              </div>
              <canvas ref={canvasRef} width={300} height={200} className="hidden"></canvas>
              <button
                onClick={captureImage}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md mt-3 hover:bg-green-700 transition transform hover:scale-105"
              >
                📷 Capture Photo
              </button>
            </>
          )}
          {image && (
            <div className="mt-4 flex flex-col items-center">
              <img src={image} alt="Captured" className="w-72 h-40 object-cover border rounded-lg shadow-lg" />
              <button
                onClick={toggleCamera}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md mt-3 hover:bg-blue-700 transition transform hover:scale-105"
              >
                📸 Open Camera
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-700 text-white w-full py-3 rounded-lg shadow-md mt-6 hover:bg-blue-800 transition transform hover:scale-105"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : "✅ Check In"}
        </button>
      </div>

      {/* Modal for Success / Error Message */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <p className="text-xl mb-4">{modalMessage}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCheckIn;
