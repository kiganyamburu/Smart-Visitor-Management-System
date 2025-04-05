import React, { useState, useEffect } from "react";

interface Visitor {
    id: string;
    name: string;
    phone: string;
    email?: string;
    visitorType: string;
    purpose: string;
    company?: string;
    idVerification: string;
    staff: string;
    status: "Pre-registered" | "Not Logged In" | "Logged In (Manual)" | "Logged In (QR Code)" | "Checked Out";
    checkInTime?: string;
    checkOutTime?: string;
    image?: string;
    qrCode?: string;
}

const VisitorManagement: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(false);
    const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const response = await fetch("htttp://localhost:3000/api/visitors");
            const data = await response.json();
            setVisitors(data);
        } catch (error) {
            const dummyVisitors: Visitor[] = Array.from({ length: 50 }, (_, i) => ({
                id: `${i + 1}`,
                name: `Visitor ${i + 1}`,
                phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
                email: `visitor${i + 1}@example.com`,
                visitorType: i % 2 === 0 ? "Guest" : "Contractor",
                purpose: ["Meeting", "Interview", "Delivery", "Maintenance", "Training"][Math.floor(Math.random() * 5)],
                company: i % 3 === 0 ? `Company ${i + 1}` : undefined,
                idVerification: `ID${1000 + i}`,
                staff: `Host ${Math.floor(Math.random() * 10) + 1}`,
                status: ["Pre-registered", "Not Logged In", "Logged In (Manual)", "Logged In (QR Code)", "Checked Out"][Math.floor(Math.random() * 5)] as Visitor["status"],
                checkInTime: Math.random() > 0.5 ? new Date().toLocaleString() : undefined,
                checkOutTime: Math.random() > 0.7 ? new Date().toLocaleString() : undefined,
                image: `https://i.pravatar.cc/100?img=${i + 1}`,
                qrCode: `https://via.placeholder.com/100?text=QR${i + 1}`,
            }));
            
            setVisitors(dummyVisitors);
            setLoading(false);
            console.error("Error fetching visitors:", error);
        }
        setLoading(false);
    };

    const handleCheckIn = async (id: string, method: "Manual" | "QR Code") => {
        setVisitors((prev) =>
            prev.map((v) =>
                v.id === id
                    ? { ...v, status: `Logged In (${method})`, checkInTime: new Date().toLocaleString() }
                    : v
            )
        );
        await fetch(`http://localhost:3000/api/visitors/${id}/checkin`, { method: "POST", body: JSON.stringify({ method }) });
    };

    const handleCheckOut = async (id: string) => {
        setVisitors((prev) =>
            prev.map((v) =>
                v.id === id ? { ...v, status: "Checked Out", checkOutTime: new Date().toLocaleString() } : v
            )
        );
        await fetch(`http://localhost:3000/api/visitors/${id}/checkout`, { method: "POST" });
    };
    const handleAddVisitor = async () => {
        if (!newVisitor.name || !newVisitor.phone || !newVisitor.purpose) return;
        const visitor = {
            ...newVisitor,
            id: String(visitors.length + 1),
            status: "Pre-registered",
        } as Visitor;
        setVisitors([...visitors, visitor]);
        setNewVisitor({});
        setShowForm(false);
        await fetch("http://localhost:3000/api/visitors", { method: "POST", body: JSON.stringify(visitor) });
    };

    return (
        <div className="p-6 bg-white min-h-screen mt-4">
            <h1 className="text-xl font-bold text-blue-700 mb-6">Visitor Management</h1>
            <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  right-1"
            >
                + Add Visitor
            </button>

            {showForm && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">New Visitor</h2>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full border p-2 mb-2"
                            onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full border p-2 mb-2"
                            onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Purpose"
                            className="w-full border p-2 mb-2"
                            onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                        />
                        <button
                            onClick={handleAddVisitor}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-red-500 mt-2 block w-full text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <table className="mt-6 w-full border-collapse border border-gray-300 shadow-lg">
                <thead>
                    <tr className="bg-gradient-to-r from-blue-400 to-blue-300 text-white">
                        <th className="border p-2">Image</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Phone</th>
                        <th className="border p-2">Purpose</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">QR Code</th>
                        <th className="border p-2">Check-In Time</th>
                        <th className="border p-2">Check-Out Time</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={7} className="text-center p-4 text-gray-500">Loading...</td>
                        </tr>
                    ) : (
                        visitors.map((visitor) => (
                            <tr key={visitor.id} className="border hover:bg-gray-100">
                                <td className="border p-2 text-center">
                                    {visitor.image ? <img src={visitor.image} alt="Visitor" className="w-12 h-12 rounded-full mx-auto" /> : "-"}
                                </td>
                                <td className="border p-3 font-medium text-gray-700">{visitor.name}</td>
                                <td className="border p-3 text-gray-600">{visitor.phone}</td>
                                <td className="border p-3 text-gray-600">{visitor.purpose}</td>
                                <td className="border p-3 font-semibold text-sm text-gray-900 bg-gray-200 rounded-lg">{visitor.status}</td>
                                <td className="border p-2 text-center">
                                    {visitor.qrCode ? <img src={visitor.qrCode} alt="QR Code" className="w-16 h-16 mx-auto" /> : "-"}
                                </td>
                                <td className="border p-3 text-gray-600">{visitor.checkInTime || "-"}</td>
                                <td className="border p-3 text-gray-600">{visitor.checkOutTime || "-"}</td>
                                <td className="border p-1">
                                    {visitor.status === "Pre-registered" && (
                                        <button
                                            onClick={() => handleCheckIn(visitor.id, "Manual")}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-green-600 mr-2"
                                        >
                                            Check In
                                        </button>
                                    )}
                                    {visitor.status.startsWith("Logged In") && !visitor.checkOutTime && (
                                        <button
                                            onClick={() => handleCheckOut(visitor.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-red-600"
                                        >
                                            Check Out
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VisitorManagement;
