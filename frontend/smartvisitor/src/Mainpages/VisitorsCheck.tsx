import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "../components/ui/button";
import logo from "../assets/smlogo.png"
import ClipLoader from "react-spinners/ClipLoader";
import VisitorDashboard from "../componets/pages/visitorPage";
import Footer from "./Footer";
import Management from "../componets/pages/VisitorManagement";


export default function VisitorManagement() {
    const [visitorId, setVisitorId] = useState("");
    const [visitorName, setVisitorName] = useState("");
    const [badgeID, setBadgeID] = useState("");
    const [department, setDepartment] = useState("IT");
    const [status, setStatus] = useState("idle");
    const [loading, setLoading] = useState(false);

    const departments = ["IT", "HR", "Finance", "Marketing", "Security"];


    useEffect(() => {
        document.title = `Welcome to ${department} Department`;
    }, [department]);

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
        <div className="min-h-screen bg-slate-300 text-white flex flex-col items-center">
            <header className="w-full fixed top-0 z-50 bg-gradient-to-b from-[#5a8d93] to-[#2b5960]
 backdrop-blur-md shadow-lg text-teal-900 py-4 px-8 flex items-center justify-between">
                {/* Left Section - Logo */}
                <div className="flex items-center gap-4">
                    <img src={logo} alt="System Logo" className="h-12 transition-transform duration-300 hover:scale-105 text-gray-100" />
                </div>

                {/* Center - Navigation & Department Selection */}
                <div className="hidden sm:flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-100">Select Department:</label>
                    <select
                        className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg cursor-pointer focus:ring-2 focus:ring-teal-400 transition-shadow duration-300 hover:shadow-md"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value="" disabled>Select a department</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                {/* Right Section - Navigation & User Actions */}
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex gap-6 text-gray-100 font-medium">
                        <a href="/" className="hover:text-teal-600 transition duration-300">Home</a>
                        <a href="/login" className="hover:text-teal-600 transition duration-300">Admin</a>
                    </nav>

                    {/* Login Button */}
                    <a href="/login" >
                    <button className="bg-teal-600 px-5 py-2 rounded-lg text-gray-100 font-semibold shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105">
                        Login
                    </button>
                    </a>
                </div>
            </header>
            <div className="mt-16 flex w-full text-gray-900 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-16"
                >
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 drop-shadow-md">
                        Smart Visitor Check <span>{department}</span> Department
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-teal-800 mt-2 text-lg max-w-lg text-center leading-relaxed"
                    >
                        ✨ Welcome! To proceed, simply choose a check-in option below.
                    </motion.p>
                <div className="hidden ">
                 <VisitorDashboard/>
                </div>
                </motion.div>
            </div>

            <div className="flex flex-col items-center w-full">
               <Management/>
            </div>

            {/* QR Code & Check-Out */}
            {status === "checked-in" && badgeID && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mt-8 p-6 bg-white text-black rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-semibold">Visitor Badge</h3>
                    <div className="flex justify-center mt-4">
                        <QRCodeCanvas value={badgeID} size={180} />
                    </div>
                    <p className="mt-2 text-lg font-semibold">{visitorName}</p>
                    <p className="text-gray-500">Department: {department}</p>
                    <p className="text-gray-500">Badge ID: {badgeID}</p>
                    <Button className="bg-red-600 text-white w-full py-2 rounded mt-4" onClick={checkOut}>
                        {loading ? <ClipLoader color="#fff" size={20} /> : "Check Out"}
                    </Button>
                </motion.div>
            )}

            {status === "checked-out" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-green-400 font-bold text-center mt-6">
                    <FaCheckCircle className="text-6xl mx-auto" />
                    <p>Successfully Checked-Out</p>
                </motion.div>
            )}
            <Footer />
        </div>
    );
}