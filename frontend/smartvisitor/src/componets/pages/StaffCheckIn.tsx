import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { Form, Input, Select, Button, Card, Modal, Spin, Typography, Row, Col } from "antd";
import { DepartmentContext } from "../../contexts/DepartmentContext";

const { Option } = Select;
const { Title, Text } = Typography;

const StaffCheckIn: React.FC = () => {
  const { department: contextDepartment } = useContext(DepartmentContext);
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const width = videoRef.current.videoWidth || 300;
        const height = videoRef.current.videoHeight || 200;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const capturedImage = canvasRef.current.toDataURL("image/png");
        setImage(capturedImage);
        stopCamera();
        setCameraActive(false);
      }
    }
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
      setCameraActive(false);
    } else {
      setImage(null);
      setCameraActive(true);
    }
  };

  const handleSubmit = async (values: any) => {
    if (
      !values.fullName ||
      !values.email ||
      !values.phoneNumber ||
      !values.idNumber ||
      !values.gender ||
      !image
    ) {
      setModalMessage("⚠️ Please fill all fields, select gender, and take a photo.");
      setModalVisible(true);
      return;
    }

    const staffData = {
      name: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      idType: values.idType,
      idNumber: values.idNumber,
      gender: values.gender,
      department: contextDepartment,
      imageUrl: image,
      checkInTime: new Date().toISOString(),
      status: "CHECKED_IN",
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/staff",
        staffData
      );
      setModalMessage(`✅ ${response.data.message || "Check-in successful! Welcome."}`);
      form.resetFields();
      setImage(null);
      setCameraActive(false);
    } catch (error: any) {
      console.error("Error during staff check-in:", error);
      setModalMessage("❌ Check-in failed. Please try again.");
    } finally {
      setLoading(false);
      setModalVisible(true);
      setImage(null);
      setCameraActive(false);
    }
  };

  return (
    <Row justify="center" style={{ padding: "24px" }}>
      <Col xs={24} sm={22} md={20} lg={18}>
        <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
            🛂 Staff Check-In
          </Title>
          {/* Form Section arranged in flex rows */}
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: "Please enter full name" }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: "Please enter phone number" }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="ID Type"
                  name="idType"
                  initialValue="NATIONAL_ID"
                  rules={[{ required: true, message: "Please select ID type" }]}
                >
                  <Select>
                    <Option value="NATIONAL_ID">National ID</Option>
                    <Option value="PASSPORT">Passport</Option>
                    <Option value="DRIVER_LICENSE">Driver's License</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="ID Number"
                  name="idNumber"
                  rules={[{ required: true, message: "Please enter ID number" }]}
                >
                  <Input placeholder="Enter ID number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
            </Row>
            <Form.Item label="Department">
              <Input value={contextDepartment} disabled />
            </Form.Item>
            {/* Camera Section at the bottom center */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <Text style={{ marginBottom: "16px" }}>Photo:</Text>
              {!cameraActive && !image && (
                <Button type="primary" onClick={toggleCamera}>
                  📸 Open Camera
                </Button>
              )}
              {cameraActive && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      borderRadius: "4px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <Button type="primary" onClick={captureImage} style={{ marginTop: "16px" }}>
                    📷 Capture Photo
                  </Button>
                </>
              )}
              {image && (
                <>
                  <img
                    src={image}
                    alt="Captured"
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      borderRadius: "4px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                  <Button type="primary" onClick={toggleCamera} style={{ marginTop: "8px" }}>
                    📸 Reopen Camera
                  </Button>
                </>
              )}
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? <Spin /> : "✅ Check In"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Modal visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)}>
          <div style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "16px" }}>{modalMessage}</Text>
            <Button type="primary" onClick={() => setModalVisible(false)} style={{ marginTop: "16px" }}>
              Close
            </Button>
          </div>
        </Modal>
      </Col>
    </Row>
  );
};

export default StaffCheckIn;
