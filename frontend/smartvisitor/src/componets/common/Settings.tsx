import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Button, Switch, Card, Space, Typography, Modal, message, Spin } from "antd";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const { Title } = Typography;
const { TabPane } = Tabs;

const dummyUserData = {
  name: "John Doe",
  email: "admin@example.com",
  phone: "+123456789",
  role: "ADMIN",
  password: "admin123",
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // System Settings
  const [darkMode, setDarkMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Profile Form Data
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user || !user.id) {
      setError("User must be logged in");
      setLoading(false);
      return;
    }
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        //console.log("Fetching user data for ID:", user.id);
        const profileEndpoint = `https://backend-lingering-flower-8936.fly.dev/api/v1/admin/${user.id}`;
        console.log("Endpoint:", profileEndpoint);
        const response = await axios.get(profileEndpoint);
        console.log("User data fetched:", response.data);
        form.setFieldsValue({
          name: response.data.name || dummyUserData.name,
          email: response.data.email || dummyUserData.email,
          phone: response.data.phoneNumber || dummyUserData.phone,
          password: "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        form.setFieldsValue(dummyUserData);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [user, form]);

  const handleProfileUpdate = async (values: any) => {
    if (!user || !user.id) return;
    try {
      setLoading(true);
      await axios.put(`https://backend-lingering-flower-8936.fly.dev/api/v1/admin/${user.id}`, values);
      message.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.id) return;
    try {
      await axios.put(`https://backend-lingering-flower-8936.fly.dev/api/admin/${user.id}/password`, { newPassword });
      message.success("Password changed successfully");
      setChangePasswordModalVisible(false);
      setNewPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      message.error("Failed to change password");
    }
  };

  const handleDownloadLogs = async () => {
    try {
      const response = await axios.get(`https://backend-lingering-flower-8936.fly.dev/api/logs/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "logs.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading logs:", err);
      message.error("Failed to download logs");
    }
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get(`https://backend-lingering-flower-8936.fly.dev/api/data/export`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export_data.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error exporting data:", err);
      message.error("Failed to export data");
    }
  };

  if (!user) return <p style={{ color: "red" }}>User not authenticated.</p>;
  if (loading) return <div style={{ textAlign: "center", padding: 20 }}><Spin /></div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <Title level={4}>Admin Settings</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Profile Settings Tab */}
        <TabPane tab="Profile Settings" key="profile">
          <Card title="Profile Details">
            <Form form={form} layout="vertical" onFinish={handleProfileUpdate}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please input your full name!" }]}>
                <Input placeholder="Full Name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Email Address" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please input your phone number!" }]}>
                <Input placeholder="Phone Number" />
              </Form.Item>
              <Form.Item name="password" label="New Password">
                <Input.Password placeholder="New Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* User & Role Management (Only for Admin) */}
        {user.role === "ADMIN" && (
          <TabPane tab="User & Role Management" key="users">
            <Card title="User & Role Management">
              <p>Manage user roles and access permissions.</p>
              <Button type="primary">Add New User</Button>
              {/* Additional user management functionalities can be added here */}
            </Card>
          </TabPane>
        )}

        {/* System Settings Tab */}
        <TabPane tab="System Settings" key="system">
          <Card title="System Settings">
            <Space direction="vertical" size="large">
              <div>
                <span style={{ marginRight: 8 }}>Enable Dark Mode</span>
                <Switch checked={darkMode} onChange={setDarkMode} />
              </div>
              <div>
                <span style={{ marginRight: 8 }}>Enable Maintenance Mode</span>
                <Switch checked={maintenanceMode} onChange={setMaintenanceMode} />
              </div>
            </Space>
          </Card>
        </TabPane>

        {/* Security & Access Tab */}
        <TabPane tab="Security & Access" key="security">
          <Card title="Security Settings">
            <Space direction="vertical" size="large">
              <div>
                <span style={{ marginRight: 8 }}>Enable Two-Factor Authentication</span>
                <Switch checked={twoFactorAuth} onChange={setTwoFactorAuth} />
              </div>
              <div>
                <Button type="primary" danger onClick={() => setChangePasswordModalVisible(true)}>
                  Change Password
                </Button>
              </div>
            </Space>
          </Card>
        </TabPane>

        {/* Notifications & Alerts Tab */}
        <TabPane tab="Notifications & Alerts" key="notifications">
          <Card title="Notification Preferences">
            <Space direction="vertical" size="large">
              <div>
                <span style={{ marginRight: 8 }}>Email Notifications</span>
                <Switch checked={emailNotifications} onChange={setEmailNotifications} />
              </div>
              <div>
                <span style={{ marginRight: 8 }}>SMS Notifications</span>
                <Switch checked={smsNotifications} onChange={setSmsNotifications} />
              </div>
            </Space>
          </Card>
        </TabPane>

        {/* Data & Reports Tab */}
        <TabPane tab="Data & Reports" key="data">
          <Card title="Data & Reports">
            <Space direction="vertical" size="middle">
              <Button onClick={handleDownloadLogs} type="default">
                Download Logs
              </Button>
              <Button onClick={handleExportData} type="default">
                Export Data
              </Button>
            </Space>
          </Card>
        </TabPane>
      </Tabs>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={changePasswordModalVisible}
        onCancel={() => setChangePasswordModalVisible(false)}
        onOk={handleChangePassword}
        okText="Change Password"
      >
        <Input.Password
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Settings;
