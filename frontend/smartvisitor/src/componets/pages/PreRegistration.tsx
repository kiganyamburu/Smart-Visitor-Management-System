import React, { useState, useContext } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Form, Input, Select, Button, Card, Typography, Row, Col, Spin, Alert } from "antd";
import { DepartmentContext } from "../../contexts/DepartmentContext";

const { Option } = Select;
const { Title, Text } = Typography;

const PreRegister: React.FC = () => {
  const { department } = useContext(DepartmentContext);
  const [form] = Form.useForm();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Include the department from context in the payload.
    const payload = { ...values, department };

    try {
      const response = await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor",
        payload
      );
      const visitorId = response.data.id;
      const qrCodeUrl = `https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/${visitorId}`;
      setQrCode(qrCodeUrl);
      setSuccess("Registration successful! QR Code has been sent to your email.");
      form.resetFields();
    } catch (err) {
      setError("Failed to register visitor. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      align="middle"
      style={{ width: "100%", padding: 10, background: "#f0f2f5" }}
    >
      <Col xs={24} sm={24} md={24} lg={24}>
        <Card
          bordered={false}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: 24,
            width: "100%",
            borderRadius: 8
          }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#1890ff", marginBottom: 24 }}>
            Visitor Pre-Registration
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter full name" }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Invalid email" },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[{ required: true, message: "Please enter phone number" }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="ID Type"
                  name="idType"
                  initialValue="NATIONAL_ID"
                  rules={[{ required: true, message: "Please select ID type" }]}
                >
                  <Select>
                    <Option value="NATIONAL_ID">National ID</Option>
                    <Option value="PASSPORT">Passport</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="ID Number"
                  name="idNumber"
                  rules={[{ required: true, message: "Please enter ID number" }]}
                >
                  <Input placeholder="Enter ID number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Purpose of Visit"
                  name="purpose"
                  rules={[{ required: true, message: "Please enter purpose of visit" }]}
                >
                  <Input placeholder="Enter purpose of visit" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Please select gender" }]}
                >
                  <Select placeholder="Select Gender">
                    <Option value="MALE">Male</Option>
                    <Option value="FEMALE">Female</Option>
                    <Option value="OTHER">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Department">
                  <Input
                    value={department}
                    disabled
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? <Spin /> : "Generate QR Code"}
              </Button>
            </Form.Item>
          </Form>
          {error && (
            <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />
          )}
          {success && (
            <Alert message={success} type="success" showIcon style={{ marginTop: 16 }} />
          )}
          {qrCode && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Title level={4}>Your QR Code</Title>
              <Text type="secondary">
                Show this QR code at the reception for check-in.
              </Text>
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",  // Ensures the content is centered horizontally
                  width: "100%",
                  marginTop: 16,
                }}
              >
                <QRCodeCanvas value={qrCode} size={200} style={{ marginTop: 16 }} />
              </div>
              <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                Scan this QR code at the reception for a smooth check-in.
              </Text>
            </div>

          )}
        </Card>
      </Col>
    </Row>
  );
};

export default PreRegister;
