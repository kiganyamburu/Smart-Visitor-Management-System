import React, { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface CheckInData {
    visitorId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE";
    idNumber: string;
    imageUrl?: string;
    checkInTime: string;
    status: "CHECKED_IN";
    hostId: string;
}

const ManualCheckIn: React.FC = () => {
    const [formData, setFormData] = useState<CheckInData>({
        visitorId: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        idType: "NATIONAL_ID",
        idNumber: "",
        imageUrl: "",
        checkInTime: new Date().toISOString(),
        status: "CHECKED_IN",
        hostId: "",
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await axios.post("/api/manual-checkin", formData);
            setMessage(`✅ ${formData.fullName} has been checked in successfully!`);
            setFormData({
                visitorId: "",
                fullName: "",
                email: "",
                phoneNumber: "",
                idType: "NATIONAL_ID",
                idNumber: "",
                imageUrl: "",
                checkInTime: new Date().toISOString(),
                status: "CHECKED_IN",
                hostId: "",
            });
        } catch (error) {
            console.error("Check-in failed:", error);
            setMessage("❌ Error checking in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-center text-gray-700">📝 Manual Check-In</h2>

            {/* Success/Error Message */}
            {message && (
                <div className={`mt-4 p-3 rounded-md text-center border ${message.includes("✅") ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                    {message}
                </div>
            )}

            {/* Check-in Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded-md" />
                
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded-md" />
                
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 border rounded-md" />
                
                <select name="idType" value={formData.idType} onChange={handleChange} className="w-full p-2 border rounded-md">
                    <option value="NATIONAL_ID">National ID</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVER_LICENSE">Driver's License</option>
                </select>
                
                <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" required className="w-full p-2 border rounded-md" />
                
                <input type="text" name="hostId" value={formData.hostId} onChange={handleChange} placeholder="Host ID" required className="w-full p-2 border rounded-md" />

                {/* Loading State */}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center gap-2">
                    {loading ? <ClipLoader color="#fff" size={20} /> : "Check In"}
                </button>
            </form>
        </div>
    );
};

export default ManualCheckIn;
