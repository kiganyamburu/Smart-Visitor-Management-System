import { useEffect, useState } from "react";
import {
  FaUserShield,
  FaEdit,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaList,
  FaKey,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import {
  Modal,
  List,
  Avatar,
  Spin,
  Button,
  Tooltip,
  Card,
  Typography,
  Space,
  Descriptions,
  Tag,
  Row,
  Col,
  Input,
} from "antd";

const { Title, Text } = Typography;

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
  authorities: Authority[];
  dateJoined: string;
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

  const dummyLogs: ActivityLog[] = [
    { id: "1", action: "Updated profile information", timestamp: "2025-04-05 14:30" },
    { id: "2", action: "Logged in", timestamp: "2025-04-05 14:00" },
    { id: "3", action: "Changed password", timestamp: "2025-04-05 13:50" },
    { id: "4", action: "Viewed user details", timestamp: "2025-04-05 13:40" },
    { id: "5", action: "Created new post", timestamp: "2025-04-05 13:30" },
    { id: "6", action: "Updated role permissions", timestamp: "2025-04-05 13:20" },
    { id: "7", action: "Logged out", timestamp: "2025-04-05 13:10" },
  ];

  useEffect(() => {
    if (user) {
      fetch(`https://backend-lingering-flower-8936.fly.dev/api/v1/admin/${user.id}`)
        .then(response => {
          if (!response.ok) {
            console.error("HTTP error, status =", response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log("Fetched profile data:", data);
          setProfile(data);
        })
        .catch(error => console.error("Profile fetch error:", error));

      // Use dummy activity logs for now
      setActivityLogs(dummyLogs);
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

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 4, background: "#f0f2f5", minHeight: "100vh" }}>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Avatar
              size={100}
              src={profile?.avatar || "https://via.placeholder.com/100"}
              style={{ border: "2px solid #d9d9d9" }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Title level={3}>{profile?.fullName || "User"}</Title>
            <Space direction="vertical">
              <Text type="secondary">
                <FaUserShield /> {profile?.role || "System User"}
              </Text>
              <Text type="secondary">Joined on {profile?.dateJoined}</Text>
            </Space>
          </Col>
          <Col xs={24} sm={6}>
            <Tooltip title="Edit profile settings">
              <Button
                type="primary"
                icon={<FaEdit />}
                onClick={() => setShowAuthModal(true)}
                block
              >
                Edit Profile
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </Card>
      {isEditing}
      <Row gutter={24}>
        {/* Contact Info */}
        <Col xs={24} md={12}>
          <Card title="Contact Information" bordered={false}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span><FaEnvelope /> Email</span>}>
                {profile?.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><FaPhone /> Phone</span>}>
                {profile?.phoneNumber}
              </Descriptions.Item>
              {profile?.role === "RECEPTIONIST" && (
                <Descriptions.Item label={<span><FaMapMarkerAlt /> Location</span>}>
                  Reception HQ
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Authorities */}
        <Col xs={24} md={12}>
          <Card title="Access Authorities" bordered={false}>
            {profile?.authorities?.length ? (
              <Space wrap>
                {profile.authorities.map((auth, index) => (
                  <Tag icon={<FaKey />} color="geekblue" key={index}>
                    {auth.authority}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No authorities assigned</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Activity Logs */}
      <Card title="Recent Activity" bordered={false} style={{ marginTop: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={activityLogs}
          renderItem={(log) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<FaList />} />}
                title={log.action}
                description={`Time: ${log.timestamp}`}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Password Confirmation Modal */}
      <Modal
        title="Confirm Identity"
        open={showAuthModal}
        onCancel={() => setShowAuthModal(false)}
        footer={null}
        centered
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" block onClick={handleAuthSubmit}>
          Confirm
        </Button>
      </Modal>
    </div>
  );
};

export default AdminProfile;
