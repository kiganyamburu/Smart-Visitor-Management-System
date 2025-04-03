import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { FaCheckCircle, FaTimesCircle, FaCamera, FaSyncAlt } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

interface User {
    name: string;
    department: string;
}

interface QrCodeResponse {
    code: string;
    valid: boolean;
    name?: User;
}

const AutoCheckIn: React.FC = () => {
    const [qrCode, setQrCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [capturing, setCapturing] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);

    const checkInUser = async (urlcode: string): Promise<void> => {
        console.log("Checking in user with QR code:", urlcode);
        setLoading(true);
        setMessage(null);

        return fetch(`${urlcode}/checkin`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log("Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid response: Expected JSON but received something else.");
                }
                return response.json();
            })
            .then((data: QrCodeResponse) => {
                console.log("Parsed JSON response:", data);
                if (data && data.name) {
                    setUser(data.name);
                    setMessage(`✅ Welcome, ${data.name}!`);
                } else {
                    setUser(null);
                    setMessage("❌ Invalid QR Code");
                }
            })
            .catch((error) => {
                console.error("Error checking in:", error);
                setMessage("❌ System error, please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to capture the image from the webcam and scan for a QR code
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
            //console.log("QR Code Data:", qrCodeData);

            if (qrCodeData) {
                // QR Code detected
                setQrCode(qrCodeData.data);
                checkInUser(qrCodeData.data);
            } else {
                // No QR code found
                setMessage("❌ No QR Code detected");
            }
            setCapturing(false);
        };

        img.onerror = () => {
            setMessage("❌ Error loading captured image");
            setCapturing(false);
        };
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 rounded-lg border border-gray-200 bg-gradient-to-r from-slate-200 to-slate-300 text-white shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800">🎫 Auto Check-In</h2>

            <div className="mt-2 relative">
                <p className="text-sm text-gray-300 text-center">Capture QR Code:</p>
                <div className="bg-gray-100 p-2 rounded-md relative shadow-md border border-gray-600">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        videoConstraints={{ facingMode: "environment" }}
                        className="w-full rounded-md"
                    />
                    <button
                        onClick={captureAndScan}
                        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition ${capturing ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={capturing}
                    >
                        <FaCamera size={24} />
                    </button>
                </div>
            </div>

            {loading && (
                <div className="mt-4 flex justify-center">
                    <ClipLoader color="#60a5fa" size={30} />
                </div>
            )}

            {qrCode && (
                <div className="mt-4 hidden p-3 bg-blue-600 rounded-md flex items-center gap-2 border border-blue-500">
                    <p className="text-white">
                        Scanned QR Code: <strong>{qrCode}</strong>
                    </p>
                </div>
            )}

            {user && (
                <div className="mt-4 p-3 bg-green-600 rounded-md flex items-center gap-2 border border-green-500">
                    <FaCheckCircle className="text-white text-xl" />
                    <p className="text-white">
                        ✅ Welcome, <strong>{user.name}</strong> from {user.department}!
                    </p>
                </div>
            )}

            {message && (
                <div className={`mt-4 p-3 rounded-md flex items-center gap-2 border ${message.includes("✅") ? "bg-green-600 border-green-500" : "bg-red-600 border-red-500"}`}>
                    {message.includes("✅") ? <FaCheckCircle className="text-white text-xl" /> : <FaTimesCircle className="text-white text-xl" />}
                    <p className="text-white">{message}</p>
                </div>
            )}

            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-900 transition"
                >
                    <FaSyncAlt /> Refresh Scanner
                </button>
            </div>
        </div>
    );
};

export default AutoCheckIn;
