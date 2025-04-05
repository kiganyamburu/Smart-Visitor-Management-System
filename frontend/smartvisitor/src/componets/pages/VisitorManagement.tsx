import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  Edit3,
  Home,
  Briefcase,
  FileText,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import CheckInOverview from "./CheckInOverview";
import ACheckIn from "./AutoCheckIn";
import MCheckIn from "./ManualCheckIn";
import GCheckIn from "./GuestCheckIn";
import SCheckIn from "./StaffCheckIn";
import VLog from "./VisitorLog";
import PreRegister from "./PreRegistration";

// Component mappings for clarity
const AutoCheckIn = () => <ACheckIn />;
const ManualCheckIn = () => <MCheckIn />;
const GuestCheckIn = () => <GCheckIn />;
const StaffCheckIn = () => <SCheckIn />;
const VisitorLog = () => <VLog />;
const HelpCenter = () => <PreRegister />;

interface CheckInButtonProps {
  label: string;
  icon: ReactNode;
  color: string; // e.g., "blue-600"
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
    <p className="mt-2 text-gray-700 text-sm font-semibold">{label}</p>
  </motion.div>
);

export default function Management() {
  const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 w-full md:max-w-3xl p-1 md:p-8">
      <header className="w-full flex justify-center mb-8">
        <h1 className="md:text-3xl text-xl font-bold">Display Board</h1>
      </header>

      <AnimatePresence mode="wait">
        {activeComponent ? (
          <motion.div
            key="activeComponent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center bg-white text-gray-900 rounded-lg shadow-xl md:p-6 p-2 mb-8 border border-gray-200"
          >
            <button
              className="self-start mb-4 flex items-center text-lg font-bold text-gray-700 hover:text-gray-500 transition"
              onClick={() => setActiveComponent(null)}
            >
              <ArrowLeft size={24} className="mr-2" /> Back
            </button>
            <div className="w-full">{activeComponent}</div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full mb-8"
          >
            <CheckInButton
              label="Auto Check-In"
              icon={<LogIn size={32} />}
              color="blue-600"
              onClick={() => setActiveComponent(<AutoCheckIn />)}
            />
            <CheckInButton
              label="Manual Check-In"
              icon={<Edit3 size={32} />}
              color="green-600"
              onClick={() => setActiveComponent(<ManualCheckIn />)}
            />
            <CheckInButton
              label="Guest Check-In"
              icon={<Home size={32} />}
              color="gray-800"
              onClick={() => setActiveComponent(<GuestCheckIn />)}
            />
            <CheckInButton
              label="Staff Check-In"
              icon={<Briefcase size={32} />}
              color="gray-700"
              onClick={() => setActiveComponent(<StaffCheckIn />)}
            />
            <CheckInButton
              label="Check Out"
              icon={<FileText size={32} />}
              color="teal-600"
              onClick={() => setActiveComponent(<VisitorLog />)}
            />
            <CheckInButton
              label="Pre Register"
              icon={<HelpCircle size={32} />}
              color="red-600"
              onClick={() => setActiveComponent(<HelpCenter />)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        <CheckInOverview />
      </div>
    </div>
  );
}
