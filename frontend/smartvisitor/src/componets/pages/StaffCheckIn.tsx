import React, { useState, useRef, useEffect } from "react";

const StaffCheckIn: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idType, setIdType] = useState("NATIONAL_ID");
  const [idNumber, setIdNumber] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
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

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 200);
        setImage(canvasRef.current.toDataURL("image/png"));
      }
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !phoneNumber || !idNumber || !image) {
      setSuccessMessage("⚠️ Please fill all fields and take a photo.");
      return;
    }

    const staffData = {
      fullName,
      email,
      phoneNumber,
      idType,
      idNumber,
      imageUrl: image,
      checkInTime: new Date().toISOString(),
      status: "CHECKED_IN",
    };

    console.log("Staff Check-In Data:", staffData);

    // Simulate API call (Replace with actual API request)
    setSuccessMessage("✅ Check-in successful! Welcome.");
    setImage(null);
    setCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-6">
      <div className="bg-slate-400 shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">🛂 Staff Check-In</h2>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-blue-500"
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
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
        />

        {/* Camera & Image Capture */}
        <div className="flex flex-col items-center">
          {!cameraActive ? (
            <button
              onClick={() => setCameraActive(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              📸 Start Camera
            </button>
          ) : (
            <>
              <div className="relative border rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay className="w-72 h-48"></video>
                <div className="absolute inset-0 border-4 border-green-500 m-6 rounded-full"></div>
              </div>
              <canvas ref={canvasRef} className="hidden"></canvas>
              <button
                onClick={captureImage}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md mt-3 hover:bg-green-700 transition"
              >
                📷 Capture Photo
              </button>
            </>
          )}
          {image && (
            <div className="mt-3">
              <img src={image} alt="Captured" className="w-72 h-40 border rounded-lg shadow-lg" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-700 text-white w-full py-3 rounded-lg shadow-md mt-4 hover:bg-blue-800 transition"
        >
          ✅ Check In
        </button>

        {/* Success / Error Message */}
        {successMessage && (
          <div className="mt-4 p-3 text-white text-center rounded-lg shadow-md bg-green-500">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffCheckIn;
