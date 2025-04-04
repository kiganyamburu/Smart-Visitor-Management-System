import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaDownload, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dummyVisitors from "../../apis/Dummy";

interface Visitor {
    id: string;
    name: string;
    phone: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: "Checked In" | "Checked Out";
    location?: string;
    staff: string;
}

const AttendanceDashboard: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVisitors();
    }, [selectedDate]);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/visitors?date=${format(selectedDate!, "yyyy-MM-dd")}`);
            const data = await response.json();
            setVisitors(data);
            setFilteredVisitors(data);
        } catch (error) {
            setVisitors(dummyVisitors);
            setFilteredVisitors(dummyVisitors);
            console.error("Error fetching visitors:", error);
        }
        setLoading(false);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        const query = e.target.value.toLowerCase();
        setFilteredVisitors(visitors.filter(visitor => visitor.name.toLowerCase().includes(query)));
    };

    const exportData = [
        ["Name", "Phone", "Check-in Time", "Check-out Time", "Status", "Location", "Host"],
        ...visitors.map(visitor => [
            visitor.name,
            visitor.phone,
            visitor.checkInTime || "N/A",
            visitor.checkOutTime || "N/A",
            visitor.status,
            visitor.location || "N/A",
            visitor.staff
        ])
    ];

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Attendance Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="p-4 bg-blue-100 text-blue-900 rounded-lg shadow">✅ Total Visitors Today: {visitors.length}</div>
                <div className="p-4 bg-green-100 text-green-900 rounded-lg shadow">⏳ Checked-in Visitors: {visitors.filter(v => v.status === "Checked In").length}</div>
                <div className="p-4 bg-yellow-100 text-yellow-900 rounded-lg shadow">🕒 Avg Visit Duration: 45 min</div>
                <div className="p-4 bg-purple-100 text-purple-900 rounded-lg shadow">🏢 Frequent Hosts: John, Jane, Alex</div>
                <div className="p-4 bg-pink-100 text-pink-900 rounded-lg shadow">📍 Visitors by Location: 3 Offices</div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center mb-4 space-x-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search visitor..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: any) => setSelectedDate(date)}
                    className="border p-2 rounded-md"
                />
                <CSVLink data={exportData} filename={`attendance_${format(selectedDate!, "yyyy-MM-dd")}.csv`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2">
                        <FaDownload /> <span>Export CSV</span>
                    </button>
                </CSVLink>
            </div>

            {/* Attendance Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Phone</th>
                        <th className="border p-2">Check-in Time</th>
                        <th className="border p-2">Check-out Time</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Host</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
                    ) : (
                        filteredVisitors.map(visitor => (
                            <tr key={visitor.id} className="border">
                                <td className="border p-2">{visitor.name}</td>
                                <td className="border p-2">{visitor.phone}</td>
                                <td className="border p-2">{visitor.checkInTime || "-"}</td>
                                <td className="border p-2">{visitor.checkOutTime || "-"}</td>
                                <td className={`border p-2 ${visitor.status === "Checked In" ? "text-green-600" : "text-red-600"}`}>{visitor.status}</td>
                                <td className="border p-2">{visitor.staff}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Alerts & Notifications */}
            <div className="mt-6 p-4 bg-red-100 text-red-900 rounded-lg shadow">
                <FaExclamationTriangle className="inline mr-2" /> 🚨 Security Alert: 2 visitors checked in but not checked out!
            </div>
        </div>
    );
};

export default AttendanceDashboard;
