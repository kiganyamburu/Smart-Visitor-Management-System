import { FiMenu, FiLogOut } from "react-icons/fi";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button, Avatar, Row, Col } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-gradient-to-b from-[#7fa6ad] to-[#3c4f54] backdrop-blur-lg shadow-lg px-6 py-3.5 text-white z-50">
      <Row align="middle" justify="space-between">
        {/* Left Section - Menu & Title */}
        <Col>
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<FiMenu />}
              onClick={toggleSidebar}
              className="md:hidden text-white text-2xl"
            />
            <h1 className="text-xl font-semibold tracking-wide">Dashboard</h1>
          </div>
        </Col>

        {/* Middle Section - Search & Actions */}
        <Col className="hidden md:flex items-center gap-4">
          <Input
            placeholder="Enter visitor ID"
            className="w-64 rounded-md border-none"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
          />
          <Button type="primary" className="bg-green-600 hover:bg-green-700 font-semibold">
            Check Out
          </Button>
        </Col>

        {/* Right Section - User Info & Logout */}
        <Col>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#d9d9d9", color: "#555" }}
              />
              <span className="hidden md:inline text-md font-medium">{user?.name}</span>
            </div>
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <FiLogOut />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
