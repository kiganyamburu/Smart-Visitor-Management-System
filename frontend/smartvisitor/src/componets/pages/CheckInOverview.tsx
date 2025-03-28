import React, { useState } from "react";
import { RefreshCw } from "lucide-react"; // Importing an icon for refresh

const CheckInOverview: React.FC = () => {
    const [recentCheckIns, setRecentCheckIns] = useState([
        { name: "John Doe", role: "Staff", time: "10:15 AM" },
        { name: "Mary Smith", role: "Visitor", time: "10:45 AM" },
        { name: "Alex Brown", role: "Guest", time: "11:00 AM" },
    ]);

    // Simulating a refresh
    const refreshCheckIns = () => {
        setRecentCheckIns([
            { name: "Emma White", role: "Staff", time: "11:30 AM" },
            { name: "Jake Blue", role: "Visitor", time: "11:45 AM" },
            { name: "Sophia Green", role: "Guest", time: "12:00 PM" },
        ]);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 p-5 bg-white rounded-lg shadow-lg">
            {/* Header with Greeting & Refresh */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">👋 Welcome Back!</h2>
                <button 
                    onClick={refreshCheckIns} 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <RefreshCw size={18} className="mr-1" />
                    Refresh
                </button>
            </div>

            {/* Today's Check-In Count */}
            <div className="bg-blue-100 text-blue-700 p-3 text-center rounded-md mb-4">
                <p className="text-lg">Total Check-Ins Today</p>
                <p className="text-2xl font-bold">42</p>
            </div>

            {/* Recent Check-Ins with Profile Icons */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">Recent Check-Ins</h3>
                <ul>
                    {recentCheckIns.map((checkIn, index) => (
                        <li key={index} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                                    {checkIn.name.charAt(0)}
                                </div>
                                <span>{checkIn.name} - {checkIn.role}</span>
                            </div>
                            <span className="text-gray-500">{checkIn.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CheckInOverview;
