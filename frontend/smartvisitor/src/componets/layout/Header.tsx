import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className=" bg-gradient-to-b from-[#7fa6ad] to-[#3c4f54] backdrop-blur-lg
 shadow-lg px-6 py-3.5 flex justify-between items-center text-white z-50">
      {/* Left Section - Menu & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="text-white text-2xl md:hidden"
        >
          <FiMenu />
        </button>
        <h1 className="text-xl font-semibold tracking-wide">Dashboard</h1>
      </div>

      {/* Middle Section - Search & Actions */}
      <div className="hidden md:flex items-center gap-4">
        <input
          type="text"
          placeholder="Enter visitor ID"
          className="px-4 py-2 text-white rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
        />
        <button className="bg-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition text-md">
          Check Out
        </button>
      </div>

      {/* Right Section - Admin Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden md:inline text-md font-medium">{user?.name}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-red-700"
        >
          <FiLogOut className="text-md" />
          <span className="hidden md:inline text-md font-semibold">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
