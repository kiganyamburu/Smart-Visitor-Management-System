import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";

const VisitorDashboard: React.FC = () => {
    const [visitorCount, setVisitorCount] = useState(5);

    useEffect(() => {
        // Simulate real-time visitor count updates
        const interval = setInterval(() => {
            setVisitorCount((prev) => prev + Math.floor(Math.random() * 3));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center ">

            {/* 📊 Live Visitor Count Card */}
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 flex items-center gap-4">
                <FaUsers className="text-4xl text-teal-600" />
                <div>
                    <p className="text-gray-600 text-sm">Current Visitors</p>
                    <p className="text-3xl font-bold text-teal-700">{visitorCount}</p>
                </div>
            </div>
        </div>
    );
};

export default VisitorDashboard;
