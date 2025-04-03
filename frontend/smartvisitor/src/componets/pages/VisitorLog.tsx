import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { FaCheckCircle, FaTimesCircle, FaCamera, FaSyncAlt, FaIdCard } from "react-icons/fa";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface QrCodeResponse {
  code: string;
  message: string;
  name?: string;
}

const AutoCheckOut: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [manualId, setManualId] = useState<string>("");
  const webcamRef = useRef<Webcam>(null);

  // useEffect to process checkout when a QR code is scanned
  useEffect(() => {
    if (qrCode) {
      // Reset any previous messages
      setMessage(null);
      checkOutUser(qrCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode]);

  // Function to checkout user via QR code
  const checkOutUser = async (code: string) => {

    setLoading(true);

    try {
      // Adjust the HTTP method (GET/POST) and endpoint as required by your backend
      const response = await axios.get<QrCodeResponse>(`${code}/checkout-qr`);

      if (response.data.name) {
        setUserName(response.data.name);
        setMessage(`✅ Checkout Successful Good Bye: ${userName}`);
      } else {
        setMessage("❌ Invalid QR Code");
      }

    } catch (error) {
      console.error("Error during checkout:", error);
      setMessage("❌ System error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to capture an image and scan for a QR code
  const captureAndScan = async () => {
    if (!webcamRef.current) return;
    setCapturing(true);
    setMessage(null);

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("❌ Failed to capture image");
      setCapturing(false);
      return;
    }

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setMessage("❌ Unable to process image");
        setCapturing(false);
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const qrCodeData = jsQR(imageData.data, img.width, img.height);

      if (qrCodeData) {
        // Set QR code which will trigger the useEffect for checkout
        setQrCode(qrCodeData.data);
      } else {
        setMessage("❌ No QR Code detected");
      }
      setCapturing(false);
    };
  };

  // Function to manually checkout using an ID
  const handleManualCheckOut = async () => {
    if (!manualId.trim()) {
      setMessage("❌ Please enter a valid ID.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Verify if your backend expects GET or POST. Here using GET.
      const response = await axios.get<QrCodeResponse>(
        `https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/${manualId}/checkout-id`);
          console.log("Manual Checkout Response:", response.data);

      if (response.data.name) {
        setUserName(response.data.name);
        setMessage(`✅ Checkout Successful Good Bye: ${userName}`);
      } else {
        setMessage("❌ Invalid ID");
      }

    } catch (error) {
      console.error("Error during manual checkout:", error);
      setMessage("❌ System error, please try again.");

    } finally {

      setLoading(false);
      setManualId("");
       // Clear the input to prevent sharing sensitive info
    }
  };

  return (
    <div className="mx-auto mt-10 md:p-6 p-2 rounded-lg shadow-lg bg-slate-100 text-white">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">🚪 Auto Checkout</h2>

      {/* Camera View */}
      <div className="mt-4 relative">
        <p className="text-sm text-gray-300 text-center">Capture QR Code:</p>
        <div className="bg-gray-300 p-2 rounded-md relative shadow-md border border-gray-600">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full rounded-md"
          />
          <button
            onClick={captureAndScan}
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition ${
              capturing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={capturing}
          >
            <FaCamera size={24} />
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4 flex justify-center text-blue-600">
          <p className="text-sm text-gray-300">Processing...</p>
          <ClipLoader color="#ffffff" size={30} />
        </div>
      )}

      {/* Display QR Code */}
      {qrCode && (
        <div className="mt-4 p-3 bg-blue-700 rounded-md flex items-center gap-2">
          <p className="text-white">
            Scanned QR Code: <strong>{qrCode}</strong>
          </p>
        </div>
      )}

      {/* Checkout Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
            message.includes("✅") ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {message.includes("✅") ? <FaCheckCircle className="text-xl" /> : <FaTimesCircle className="text-xl" />}
          <p>{message}</p>
        </div>
      )}

      {/* Manual Checkout Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-center text-gray-800">Manual Checkout</h3>
        <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <FaIdCard className="text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Enter ID Number"
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
          </div>
          <button
            onClick={handleManualCheckOut}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Checkout Manually
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>
    </div>
  );
};

export default AutoCheckOut;
