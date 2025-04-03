import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface GuestCheckInData {
    visitorId: string;
    name: string;
    email: string;
    phone: string;
    idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE";
    idNumber: string;
    // imageUrl: string;
    qrCode: string;
    checkInTime: string;
    checkOutTime: string;
    status: "CHECKED_IN";
    // hostId: string;
    role: "GUEST";
}

const GuestCheckIn: React.FC = () => {
    const [formData, setFormData] = useState<GuestCheckInData>({
        visitorId: "",
        name: "",
        email: "",
        phone: "",
        idType: "NATIONAL_ID",
        idNumber: "",
        // imageUrl: "",
        qrCode: "",
        checkInTime: new Date().toISOString(),
        checkOutTime: "",
        status: "CHECKED_IN",
        // hostId: "",
        role: "GUEST",
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Handle Form Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                context.drawImage(videoRef.current, 0, 0, 320, 240);
                // Stop Camera
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
            const response = await axios.post("https://90ad-102-213-241-210.ngrok-free.app/api/v1/visitor/guest-checkin", formData);
            setMessage(`✅ ${formData.name} has been checked in successfully!`);
            setFormData({
                visitorId: "",
                name: "",
                email: "",
                phone: "",
                idType: "NATIONAL_ID",
                idNumber: "",
                // imageUrl: "",
                qrCode: "",
                checkInTime: new Date().toISOString(),
                checkOutTime: "",
                status: "CHECKED_IN",
                // hostId: "",
                role: "GUEST",
            });
            console.log(response);
        } catch (error) {
            console.error("Guest Check-in Failed:", error);
            setMessage("❌ Error checking in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-center text-gray-700">🛂 Guest Check-In</h2>

            {/* Success/Error Message */}
            {message && (
                <div className={`mt-4 p-3 rounded-md text-center border ${message.includes("✅") ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                    {message}
                </div>
            )}

            {/* Check-in Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded-md" />
                
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded-md" />
                
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 border rounded-md" />
                
                <select name="idType" value={formData.idType} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="NATIONAL_ID">National ID</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVER_LICENSE">Driver's License</option>
                </select>
                
                <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" required className="w-full p-2 border rounded-md" />
                
                {/* <input type="text" name="hostId" value={formData.hostId} onChange={handleChange} placeholder="Host ID" required className="w-full p-2 border rounded-md" /> */}

                {/* Photo Capture Section */}
                {cameraActive ? (
                    <div className="flex flex-col items-center">
                        <video ref={videoRef} autoPlay className="w-64 h-48 border rounded-md"></video>
                        <button type="button" onClick={capturePhoto} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                            📸 Capture Photo
                        </button>
                        <button type="button" onClick={stopCamera} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                            ❌ Stop Camera
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={startCamera} className="hidden w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-800 transition">
                        📷 Open Camera
                    </button>
                )}


                {/* Loading State */}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center gap-2">
                    {loading ? <ClipLoader color="#fff" size={20} /> : "Check In"}
                </button>
            </form>

            <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
        </div>
    );
};

export default GuestCheckIn;
