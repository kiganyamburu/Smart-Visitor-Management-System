import { useState, useEffect, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "../components/ui/button";
import logo from "../assets/smlogo.png";
import ClipLoader from "react-spinners/ClipLoader";
import VisitorDashboard from "../componets/pages/visitorPage";
import Footer from "./Footer";
import Management from "../componets/pages/VisitorManagement";
import { DepartmentContext } from "../contexts/DepartmentContext"; // Import your department context

export default function VisitorManagementPage() {
    // Get department and its setter from context
    const { department, setDepartment } = useContext(DepartmentContext);

    const [visitorId, setVisitorId] = useState("");
    const [visitorName, setVisitorName] = useState("");
    const [badgeID, setBadgeID] = useState("");
    const [status, setStatus] = useState("idle");
    const [loading, setLoading] = useState(false);

    const departments = ["IT", "HR", "Finance", "Marketing", "Security"];

    useEffect(() => {
        document.title = `Welcome to ${department} Department`;
        if (visitorId) {
            setStatus("checked-in");
            setBadgeID(visitorId);
        }
    }, [department, visitorId]);

    const checkOut = () => {
        setLoading(true);
        setTimeout(() => {
            setStatus("checked-out");
            setBadgeID("");
            setVisitorName("");
            setVisitorId("");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-[#3b7c88] via-[#29555c] to-[#1e3d43] backdrop-blur-md shadow-xl text-white py-4 px-6 sm:px-10 flex items-center justify-between transition-all duration-300">
                {/* Logo */}
                <div className="md:flex hidden items-center gap-4">
                    <img
                        src={logo}
                        alt="System Logo"
                        className="h-12 w-auto transition-transform duration-300 hover:scale-110 drop-shadow-lg"
                    />
                    <span className="text-xl font-bold tracking-wide hidden sm:inline-block">
                        Smart Visitor
                    </span>
                </div>

                {/* Department Selector (Responsive) */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <label className="text-sm font-semibold text-gray-100 hidden sm:inline-block">
                        Select Department:
                    </label>
                    <select
                        className="bg-white/90 border border-gray-300 text-gray-800 p-2 sm:p-2.5 rounded-lg cursor-pointer focus:ring-2 focus:ring-cyan-400 transition-all duration-300 hover:shadow-md shadow-sm text-sm sm:text-base"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a department
                        </option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Navigation & Actions */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <nav className="hidden md:flex gap-4 sm:gap-6 text-gray-100 font-medium text-sm sm:text-base">
                        <a
                            href="/"
                            className="hover:text-cyan-300 transition-colors duration-300"
                        >
                            Home
                        </a>
                        <a
                            href="/login"
                            className="hover:text-cyan-300 transition-colors duration-300"
                        >
                            Admin
                        </a>
                    </nav>
                    <a href="/login">
                        <button className="bg-cyan-600 hover:bg-cyan-700 px-4 sm:px-5 py-2 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            Login
                        </button>
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="md:pt-26 pt-24 flex-1 w-full">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center justify-center text-center px-6 md:px-16 md:mb-12 mb-6"
                >
                    <h2 className="text-xl md:text-3xl font-extrabold text-gray-800 drop-shadow-md">
                        Smart Visitor Check <span className="text-teal-600">{department}</span> Department
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-teal-800 mt-2 text-lg max-w-lg leading-relaxed"
                    >
                        ✨ Welcome! To proceed, simply choose a check-in option below.
                    </motion.p>
                    <div className="hidden">
                        <VisitorDashboard />
                    </div>
                </motion.div>

                {/* Management Section */}
                <section className="w-full flex flex-col items-center md:px-4 px-2">
                    <Management />
                </section>

                {/* QR Code & Check-Out Card */}
                {status === "checked-in" && badgeID && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8 mx-auto max-w-md p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl text-center border border-gray-200"
                    >
                        <h3 className="text-2xl font-semibold mb-4">Visitor Badge</h3>
                        <div className="flex justify-center mb-4">
                            <QRCodeCanvas value={badgeID} size={180} />
                        </div>
                        <p className="text-xl font-semibold">{visitorName}</p>
                        <p className="text-gray-500">Department: {department}</p>
                        <p className="text-gray-500">Badge ID: {badgeID}</p>
                        <Button
                            className="bg-red-600 text-white w-full py-2 rounded mt-4 hover:bg-red-700 transition duration-300"
                            onClick={checkOut}
                        >
                            {loading ? <ClipLoader color="#fff" size={20} /> : "Check Out"}
                        </Button>
                    </motion.div>
                )}

                {status === "checked-out" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-green-500 font-bold text-center mt-8"
                    >
                        <FaCheckCircle className="text-7xl mx-auto" />
                        <p className="mt-2 text-2xl">Successfully Checked-Out</p>
                    </motion.div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
