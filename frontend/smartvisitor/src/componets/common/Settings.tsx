import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const dummyUserData = {
    name: "John Doe",
    email: "admin@example.com",
    phone: "+123456789",
    role: "admin",
    password: "admin123",
};

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [formData, setFormData] = useState({
        name: dummyUserData.name,
        email: dummyUserData.email,
        phone: dummyUserData.phone,
        password: "",
    });

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                console.log("Fetching user data...");

                const response = await axios.get(`http://localhost:3000/api/admin/${user.id}`);

                console.log("User data fetched:", response.data);

                setFormData({
                    name: response.data.name || dummyUserData.name,
                    email: response.data.email || dummyUserData.email,
                    phone: response.data.phone || dummyUserData.phone,
                    password: "",
                });
            } catch (err) {
                console.error("Error fetching user data:", err);
                setFormData(dummyUserData);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!user) return <p className="text-red-600">User not authenticated.</p>;
    if (loading) return <ClipLoader color="#2563eb" size={25} />;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6 bg-white min-h-screen ">
            <h1 className="text-xl font-bold text-blue-700 mb-6">Admin Settings</h1>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b pb-2 text-gray-600">
                {[
                    { key: "profile", label: "Profile Settings" },
                    ...(user.role === "super_admin" ? [{ key: "users", label: "User & Role Management" }] : []),
                    { key: "system", label: "System Settings" },
                    { key: "security", label: "Security & Access" },
                    { key: "notifications", label: "Notifications & Alerts" },
                    { key: "data", label: "Data & Reports" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 ${activeTab === tab.key ? "border-b-2 border-blue-600 text-blue-700 font-bold" : "hover:text-blue-500"}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Settings */}
            {activeTab === "profile" && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-4">Profile Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 border rounded" />
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full p-2 border rounded" />
                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-2 border rounded" />
                        <input type="password" name="password" onChange={handleInputChange} placeholder="New Password" className="w-full p-2 border rounded" />
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
                </div>
            )}

            {/* User & Role Management - Only for Super Admin */}
            {activeTab === "users" && user.role === "super_admin" && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">User & Role Management</h2>
                    <p>Manage user roles and access permissions.</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Add New User</button>
                </div>
            )}

            {/* System Settings */}
            {activeTab === "system" && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">System Settings</h2>
                    <label className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        Enable Dark Mode
                    </label>
                    <label className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                        Enable Maintenance Mode
                    </label>
                </div>
            )}

            {/* Security & Access */}
            {activeTab === "security" && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">Security Settings</h2>
                    <label className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                        Enable Two-Factor Authentication
                    </label>
                    <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded">Change Password</button>
                </div>
            )}

            {/* Notifications & Alerts */}
            {activeTab === "notifications" && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">Notification Preferences</h2>
                    <label className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                        Email Notifications
                    </label>
                    <label className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
                        SMS Notifications
                    </label>
                </div>
            )}

            {/* Data & Reports */}
            {activeTab === "data" && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">Data & Reports</h2>
                    <button className="bg-gray-700 text-white px-4 py-2 rounded mt-2">Download Logs</button>
                    <button className="bg-gray-700 text-white px-4 py-2 rounded mt-2 ml-2">Export Data</button>
                </div>
            )}
        </div>
    );
};

export default Settings;
