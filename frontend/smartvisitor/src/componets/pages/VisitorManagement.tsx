import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import {
    LogIn, Edit3, Home, Briefcase, FileText, HelpCircle, ArrowLeft
} from "lucide-react";
import CheckInOverview from "./CheckInOverview";
import ACheckIn from "./AutoCheckIn";
import MCheckIn from "./ManualCheckIn";
import GCheckIn from "./GuestCheckIn";
import SCheckIn from "./StaffCheckIn";
import VLog from "./VisitorLog";
import PreRegister from "./PreRegistration";

const AutoCheckIn = () => <ACheckIn />;
const ManualCheckIn = () => <MCheckIn />;
const GuestCheckIn = () => <GCheckIn />;
const StaffCheckIn = () => <SCheckIn />;
const VisitorLog = () => <VLog />;
const HelpCenter = () => <PreRegister />;

interface CheckInButtonProps {
    label: string;
    icon: ReactNode;
    color: string;
    onClick: () => void;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ label, icon, color, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center cursor-pointer"
        onClick={onClick}
    >
        <div
            className={`bg-${color} hover:bg-opacity-80 text-white w-24 h-24 flex items-center justify-center rounded-xl shadow-lg border border-gray-300 transition-all duration-300`}
        >
            {icon}
        </div>
        <p className="mt-2 text-gray-900 text-sm font-semibold">{label}</p>
    </motion.div>
);

export default function Management() {
    const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);

    return (
        <div className="bg-slate-300 text-gray-900 flex flex-col items-center w-full p-8 min-h-screen">
            {activeComponent ? (
                <div className="bg-slate-300 flex flex-col items-center w-full max-w-2xl p-6 rounded-lg shadow-md mt-5 border border-gray-200">
                    <button 
                        className="self-start mb-4 flex items-center text-lg font-bold text-gray-700 hover:text-gray-500 transition"
                        onClick={() => setActiveComponent(null)}
                    >
                        <ArrowLeft size={24} className="mr-2" /> Back
                    </button>
                    <div className="w-full text-center">{activeComponent}</div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl mt-5 mb-12">
                    <CheckInButton label="Auto Check-In" icon={<LogIn size={32} />} color="blue-600" onClick={() => setActiveComponent(<AutoCheckIn />)} />
                    <CheckInButton label="Manual Check-In" icon={<Edit3 size={32} />} color="green-600" onClick={() => setActiveComponent(<ManualCheckIn />)} />
                    <CheckInButton label="Guest Check-In" icon={<Home size={32} />} color="gray-500" onClick={() => setActiveComponent(<GuestCheckIn />)} />
                    <CheckInButton label="Staff Check-In" icon={<Briefcase size={32} />} color="gray-700" onClick={() => setActiveComponent(<StaffCheckIn />)} />
                    <CheckInButton label="Check Out" icon={<FileText size={32} />} color="teal-600" onClick={() => setActiveComponent(<VisitorLog />)} />
                    <CheckInButton label="Pre Register" icon={<HelpCircle size={32} />} color="red-600" onClick={() => setActiveComponent(<HelpCenter />)} />
                </div>
            )}
            <CheckInOverview />
        </div>
    );
}