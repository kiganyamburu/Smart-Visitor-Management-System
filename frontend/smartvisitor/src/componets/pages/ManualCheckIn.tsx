import React, { useState, useContext } from "react";
import axios from "axios";
import { Form, Input, Button, Select, Row, Col, Typography, Alert, Card } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DepartmentContext } from "../../contexts/DepartmentContext";

const { Title } = Typography;
const { Option } = Select;

interface CheckInData {
  name: string;
  email: string;
  phone: string;
  idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE";
  idNumber: string;
  imageUrl?: string;
  checkInTime: string;
  status: "CHECKED_IN";
  hostId: string;
  gender: string;
  department: string;
}

const ManualCheckIn: React.FC = () => {
  const { department } = useContext(DepartmentContext);

  const initialData: CheckInData = {
    name: "",
    email: "",
    phone: "",
    idType: "NATIONAL_ID",
    idNumber: "",
    checkInTime: new Date().toISOString(),
    status: "CHECKED_IN",
    hostId: "",
    gender: "",
    department: department,
  };

  const [formData, setFormData] = useState<CheckInData>(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (changedValues: Partial<CheckInData>) => {
    setFormData((prev) => ({ ...prev, ...changedValues }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Full Name is required.";
    if (!formData.email.includes("@")) return "A valid Email is required.";
    if (!formData.phone.trim()) return "Phone Number is required.";
    if (!formData.idNumber.trim()) return "ID Number is required.";
    if (!formData.gender) return "Please select a gender.";
    return null;
  };

  const handleSubmit = async () => {
    setMessage(null);

    const errorMessage = validateForm();
    if (errorMessage) {
      setMessage(`❌ ${errorMessage}`);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, department };
      await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/manual-checkin",
        payload
      );
      setMessage(`✅ ${formData.name} has been checked in successfully!`);
      setFormData({ ...initialData, department });
    } catch (error) {
      console.error("Check-in failed:", error);
      setMessage("❌ Error checking in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:p-6 p-2 bg-gradient-to-br from-purple-100 to-white">
      <Card
        className="w-full max-w-[1200px] mx-auto"
        bordered={false}
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          borderRadius: "1rem",
        }}
      >
        <Title level={4} style={{ textAlign: "center", color: "#722ed1" }}>
          📝 Manual Visitor Check-In
        </Title>

        {message && (
          <Alert
            message={message.replace(/^✅|^❌/, "")}
            type={message.includes("✅") ? "success" : "error"}
            showIcon
            className="my-4"
          />
        )}

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formData}
          onValuesChange={( all) => handleChange(all)}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                <Input placeholder="john@example.com" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                <Input placeholder="0712345678" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="ID Type" name="idType" rules={[{ required: true }]}>
                <Select>
                  <Option value="NATIONAL_ID">National ID</Option>
                  <Option value="PASSPORT">Passport</Option>
                  <Option value="DRIVER_LICENSE">Driver's License</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="ID Number" name="idNumber" rules={[{ required: true }]}>
                <Input placeholder="ID123456" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                <Select placeholder="Select gender">
                  <Option value="MALE">Male</Option>
                  <Option value="FEMALE">Female</Option>
                  <Option value="OTHER">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Department">
                <Input value={department} readOnly disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={loading ? <LoadingOutlined /> : undefined}
              block
              size="large"
              style={{
                backgroundColor: "#722ed1",
                borderColor: "#722ed1",
                marginTop: "1rem",
              }}
            >
              {loading ? "Checking In..." : "Check In"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ManualCheckIn;
