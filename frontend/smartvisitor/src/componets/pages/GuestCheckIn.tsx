import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { DepartmentContext } from "../../contexts/DepartmentContext";
import { Button, Form, Input, Select, Card, Typography, message, Row, Col } from "antd";
import { CameraOutlined, ReloadOutlined } from "@ant-design/icons";


const { Option } = Select;
const { Title } = Typography;

interface GuestCheckInData {
  id: string;
  name: string;
  email: string;
  phone: string;
  idType: "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE";
  idNumber: string;
  imageUrl?: string;
  qrCode: string;
  checkInTime: string;
  checkOutTime: string;
  status: "CHECKED_IN";
  role: "GUEST";
  gender: string;
  department: string;
}

const GuestCheckIn: React.FC = () => {
  const { department } = useContext(DepartmentContext);

  const initialData: GuestCheckInData = {
    id: "",
    name: "",
    email: "",
    phone: "",
    idType: "NATIONAL_ID",
    idNumber: "",
    qrCode: "",
    checkInTime: new Date().toISOString(),
    checkOutTime: "",
    status: "CHECKED_IN",
    role: "GUEST",
    gender: "",
    department,
  };

  const [formData, setFormData] = useState<GuestCheckInData>(initialData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (changed: Partial<GuestCheckInData>) => {
    setFormData((prev) => ({ ...prev, ...changed }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      message.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        setFormData((prev) => ({ ...prev, imageUrl: imageData }));
        stopCamera();
      }
    }
  };

  useEffect(() => () => stopCamera(), []);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage(null);

    try {
      const payload = { ...formData, department };
      await axios.post(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/guest-checkin",
        payload
      );
      setSuccessMessage(`✅ ${formData.name} checked in successfully!`);
      setFormData({ ...initialData, department });
      setCapturedImage(null);
    } catch (err) {
      message.error("❌ Error checking in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
      <Title level={3} className="text-center">🛂 Guest Check-In</Title>

      {successMessage && (
        <div className="my-4 p-3 rounded-md text-center bg-green-100 text-green-700">
          {successMessage}
        </div>
      )}

      <Form layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item label="Full Name" required>
              <Input
                value={formData.name}
                onChange={(e) => handleChange({ name: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Email" required>
              <Input
                value={formData.email}
                type="email"
                onChange={(e) => handleChange({ email: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Phone Number" required>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange({ phone: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="ID Type" required>
              <Select
                value={formData.idType}
                onChange={(value) => handleChange({ idType: value })}
              >
                <Option value="NATIONAL_ID">National ID</Option>
                <Option value="PASSPORT">Passport</Option>
                <Option value="DRIVER_LICENSE">Driver's License</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="ID Number" required>
              <Input
                value={formData.idNumber}
                onChange={(e) => handleChange({ idNumber: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Gender" required>
              <Select
                value={formData.gender}
                onChange={(value) => handleChange({ gender: value })}
              >
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Department">
              <Input value={department} readOnly disabled />
            </Form.Item>
          </Col>

          <Col xs={24}>
            {cameraActive ? (
              <div className="flex flex-col items-center">
                <video ref={videoRef} className="w-80 h-60 border rounded-md" />
                <Button type="primary" className="mt-2" onClick={capturePhoto} icon={<CameraOutlined />}>Capture Photo</Button>
                <Button danger className="mt-2" onClick={stopCamera}>Stop Camera</Button>
              </div>
            ) : capturedImage ? (
              <div className="flex flex-col items-center">
                <img src={capturedImage} className="w-80 h-60 object-cover rounded-md border" />
                <Button className="mt-2" icon={<ReloadOutlined />} onClick={() => {
                  setCapturedImage(null);
                  handleChange({ imageUrl: "" });
                  startCamera();
                }}>
                  Retake Photo
                </Button>
              </div>
            ) : (
              <Button onClick={startCamera} className="w-full" icon={<CameraOutlined />}>Open Camera</Button>
            )}
            <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          </Col>

          <Col span={24}>
            <Button
              htmlType="submit"
              type="primary"
              loading={loading}
              className="w-full"
            >
              Check In
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default GuestCheckIn;
