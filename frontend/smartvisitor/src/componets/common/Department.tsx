import { useState, useEffect } from "react";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaClock, FaUserShield, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";

interface Department {
  id: string;
  name: string;
  location: string;
  admins: string[];
  receptionists: string[];
  operatingHours: string;
}

const dummyDepartments: Department[] = [
    {
      id: "dept-001",
      name: "Human Resources",
      location: "Building A, 3rd Floor",
      admins: ["admin1@example.com", "admin2@example.com"],
      receptionists: ["receptionist1@example.com", "receptionist2@example.com"],
      operatingHours: "08:00 AM - 05:00 PM",
    },
    {
      id: "dept-002",
      name: "IT Support",
      location: "Building B, 2nd Floor",
      admins: ["admin3@example.com"],
      receptionists: ["receptionist3@example.com", "receptionist4@example.com"],
      operatingHours: "09:00 AM - 06:00 PM",
    },
    {
      id: "dept-003",
      name: "Finance",
      location: "Building C, 1st Floor",
      admins: ["admin4@example.com", "admin5@example.com"],
      receptionists: ["receptionist5@example.com"],
      operatingHours: "08:30 AM - 04:30 PM",
    },
    {
      id: "dept-004",
      name: "Marketing",
      location: "Building D, 5th Floor",
      admins: ["admin6@example.com"],
      receptionists: ["receptionist6@example.com", "receptionist7@example.com"],
      operatingHours: "09:00 AM - 05:30 PM",
    }
  ];

const Department = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/departments");
      setDepartments(response.data);
    } catch (error) {
      setDepartments(dummyDepartments);
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDepartment = async () => {
    try {
      if (isEditing && selectedDepartment) {
        await axios.put(`http://localhost:3000/api/departments/${selectedDepartment.id}`, selectedDepartment);
      } else {
        await axios.post("http://localhost:3000/api/departments", newDepartment);
      }
      fetchDepartments();
      setShowModal(false);
      setIsEditing(false);
      setNewDepartment({});
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-lg w-full mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaBuilding className="text-blue-600 mr-2" /> Department Management
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#4A90E2" size={25} />
        </div>
      ) : (
        <>
          {user?.role === "super_admin" && (
            <button
              className="mb-3 bg-blue-600 text-white px-3 py-1 text-sm rounded-md flex items-center gap-2 hover:bg-blue-700"
              onClick={() => {
                setNewDepartment({});
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              <FaPlus /> Add Department
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <div key={department.id} className="bg-white p-4 rounded-md shadow">
                <h3 className="text-md font-medium text-gray-700 flex items-center">
                  <FaBuilding className="text-indigo-600 mr-1" /> {department.name}
                </h3>
                <p className="text-md text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="text-green-600 mr-1" /> Location: {department.location}
                </p>
                <p className="text-md text-gray-600 flex items-center">
                  <FaClock className="text-yellow-600 mr-1" /> Hours: {department.operatingHours}
                </p>
                <p className="text-md text-gray-600 flex items-center">
                  <FaUserShield className="text-red-600 mr-1" /> Admins: {department.admins.length}
                </p>
                <p className="text-md text-gray-600 flex items-center">
                  <FaUserShield className="text-blue-600 mr-1" /> Receptionists: {department.receptionists.length}
                </p>

                {user?.role === "super_admin" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 text-md rounded hover:bg-yellow-600 flex items-center gap-1"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setIsEditing(true);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 text-md rounded hover:bg-red-600 flex items-center gap-1"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} className="bg-white p-4 rounded-lg shadow-lg w-80 mx-auto mt-16">
            <h2 className="text-lg font-semibold mb-3">{isEditing ? "Edit Department" : "Add New Department"}</h2>
            <input
              type="text"
              value={newDepartment.name || ""}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              placeholder="Department Name"
              className="w-full border p-2 text-sm rounded mb-3"
            />
            <input
              type="text"
              value={newDepartment.location || ""}
              onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
              placeholder="Location"
              className="w-full border p-2 text-sm rounded mb-3"
            />
            <input
              type="text"
              value={newDepartment.operatingHours || ""}
              onChange={(e) => setNewDepartment({ ...newDepartment, operatingHours: e.target.value })}
              placeholder="Operating Hours"
              className="w-full border p-2 text-sm rounded mb-3"
            />
            <button onClick={handleSaveDepartment} className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 w-full">
              Save
            </button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Department;
