import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { FaCheckCircle, FaTimesCircle, FaCamera, FaSyncAlt, FaIdCard } from "react-icons/fa";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface QrCodeResponse {
    code: string;
    valid: boolean;
    name?: string;
}

const AutoCheckOut: React.FC = () => {
    const [qrCode, setQrCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [capturing, setCapturing] = useState<boolean>(false);
    const [manualId, setManualId] = useState<string>("");
    const [validCodes, setValidCodes] = useState<string[]>([]);
    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        const fetchValidQrCodes = async () => {
            try {
                const response = await axios.get<QrCodeResponse[]>("/api/valid-qrcodes");
                setValidCodes(response.data.map(qr => qr.code));
            } catch (error) {
                console.error("Error fetching QR codes:", error);
                setMessage("⚠️ Failed to fetch QR codes");
            }
        };
        fetchValidQrCodes();
    }, []);

    const checkOutUser = async (code: string) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await axios.post<QrCodeResponse>("/api/checkout", { code });
            if (response.data.valid) {
                setUserName(response.data.name || "Guest");
                setMessage(`✅ Checkout Successful: ${response.data.name}`);
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
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const qrCodeData = jsQR(imageData.data, img.width, img.height);

            if (qrCodeData) {
                setQrCode(qrCodeData.data);
                if (validCodes.includes(qrCodeData.data)) {
                    checkOutUser(qrCodeData.data);
                } else {
                    setMessage("❌ QR Code not recognized");
                }
            } else {
                setMessage("❌ No QR Code detected");
            }

            setCapturing(false);
        };
    };

    const handleManualCheckOut = async () => {
        if (!manualId) {
            setMessage("❌ Please enter an ID number");
            return;
        }
        checkOutUser(manualId);
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-slate-900 text-white">
            <h2 className="text-2xl font-bold text-center mb-4">🚪 Auto Checkout</h2>

            {/* Camera View */}
            <div className="mt-4 relative">
                <p className="text-sm text-gray-300 text-center">Capture QR Code:</p>
                <div className="bg-gray-800 p-2 rounded-md relative shadow-md border border-gray-600">
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
                <div className="mt-4 flex justify-center">
                    <ClipLoader color="#ffffff" size={30} />
                </div>
            )}

            {/* Display QR Code */}
            {qrCode && (
                <div className="mt-4 p-3 bg-blue-700 rounded-md flex items-center gap-2">
                    <p className="text-white">Scanned QR Code: <strong>{qrCode}</strong></p>
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
                <h3 className="text-lg font-semibold text-center">Manual Checkout</h3>
                <div className="mt-2 bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="flex items-center gap-2">
                        <FaIdCard className="text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Enter ID Number"
                            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition"
                >
                    <FaSyncAlt /> Refresh
                </button>
            </div>
        </div>
    );
};

export default AutoCheckOut;
