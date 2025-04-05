import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserShield,
  FaEdit,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaList,
  FaCalendarAlt,
  FaKey,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";

interface Authority {
  authority: string;
}

interface Profile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "ADMIN" | "RECEPTIONIST";
  avatar?: string;
  assignedLocation?: string; // For Receptionist
  authorities: Authority[];
  dateJoined?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
}

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const role = user.role;
      const profileEndpoint = role === "super_admin" 
        ? `http://localhost:3000/api/admin/profile/${user.id}`
        : `/api/receptionist/profile/${user.id}`;
      const logsEndpoint = role === "super_admin"
        ? `http://localhost:3000/api/admin/logs/${user.id}`
        : `/api/receptionist/logs/${user.id}`;

      axios
        .get(profileEndpoint)
        .then((response) => setProfile(response.data))
        .catch((error) => console.error("Error fetching profile:", error));

      axios
        .get(logsEndpoint)
        .then((response) => setActivityLogs(response.data))
        .catch((error) => console.error("Error fetching logs:", error));

      setIsLoading(false);
    }
  }, [user]);

  const handleAuthSubmit = () => {
    if (password === "admin123") {
      setShowAuthModal(false);
      setIsEditing(true);
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-8 rounded-2xl shadow-xl w-full mx-auto">
      {isLoading ? (
        <ClipLoader color="#4A90E2" size={50} />
      ) : (
        <>
          {/* Profile Header */}
          <div className="flex items-center border-b pb-6 mb-4 shadow-xl p-4 rounded-lg">
            <img
              src={profile?.avatar || "https://via.placeholder.com/100"}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow-md"
            />
            {isEditing}
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-800">{profile?.fullName || "User"}</h2>
              <p className="text-gray-600 flex items-center text-lg">
                <FaUserShield className="text-indigo-600 mr-2" />
                {profile?.role || "System User"}
              </p>
            </div>
            <button
              className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
              onClick={() => setShowAuthModal(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-600" />
                <p>
                  <span className="font-semibold">Email:</span> {profile?.email || "user@example.com"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-green-600" />
                <p>
                  <span className="font-semibold">Phone:</span> {profile?.phoneNumber || "+123456789"}
                </p>
              </div>

              {/* Only for Receptionists */}
              {profile?.role === "RECEPTIONIST" && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  <p>
                    <span className="font-semibold">Assigned Location:</span> {profile?.assignedLocation || "Not Assigned"}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-600" />
                <p>
                  <span className="font-semibold">Date Joined:</span> {profile?.dateJoined || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Authorities */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Authorities</h3>
            <div className="flex flex-wrap gap-3">
              {profile?.authorities.length ? (
                profile.authorities.map((auth, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-sm">
                    <FaKey className="inline mr-1" /> {auth.authority}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No authorities assigned.</p>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Logs</h3>
            <div className="max-h-48 overflow-y-auto">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="p-2 border-b border-gray-200 text-gray-600">
                    <FaList className="inline-block text-blue-600 mr-2" /> {log.action} - {log.timestamp}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No activity logs available.</p>
              )}
            </div>
          </div>

          {/* Authentication Modal */}
          <Modal isOpen={showAuthModal} onRequestClose={() => setShowAuthModal(false)} className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20">
            <h2 className="text-xl font-bold mb-4">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border p-2 rounded mb-4"
            />
            <button onClick={handleAuthSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Confirm
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AdminProfile;
