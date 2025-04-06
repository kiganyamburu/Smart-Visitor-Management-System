import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import axios from "axios";
import { Card, Button, Input, Spin, Alert, Row, Col, Typography } from "antd";
import {
  SyncOutlined,
  IdcardOutlined,
} from "@ant-design/icons";


const { Title, Text } = Typography;

interface QrCodeResponse {
  code: string;
  message: string;
  name?: string;
}

const AutoCheckOut: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [manualId, setManualId] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(true);
  const webcamRef = useRef<Webcam>(null);
  const scanningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // When a QR code is set, trigger the checkout process and stop scanning.
  useEffect(() => {
    if (qrCode) {
      setMessage(null);
      setScanning(false);
      stopScanning();
      checkOutUser(qrCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCode]);

  // Continuous scanning loop
  useEffect(() => {
    if (scanning) {
      scanningIntervalRef.current = setInterval(() => {
        scanFrame();
      }, 500);
    }
    return () => {
      stopScanning();
    };
  }, [scanning]);

  const stopScanning = () => {
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }
  };

  // Process a single frame from the webcam to detect a QR code.
  const scanFrame = () => {
    setMessage(null);
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, img.width, img.height);
      if (code) {
        setQrCode(code.data);
      }
    };
  };

  // Function to checkout user via QR code.
  const checkOutUser = async (code: string) => {
    console.log(userName)
    setLoading(true);
    try {
      const response = await axios.get<QrCodeResponse>(`${code}/checkout-qr`);
      //console.log(response.data);

      if (response.status === 200) {
        setQrCode("");
        setManualId("");
        setScanning(true);
        setUserName("Visitor");
        setMessage(`✅  ${response.data}`);
      } else {
  
        setMessage(`❌ ${response.data}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);

      setMessage("❌ System error, please try again.");
    } finally {
      setLoading(false);
      timeout(() => {
        setQrCode("");
        setManualId("");
        setScanning(true);
        setUserName("Visitor");
      }, 5000);
    }
  };

  // Handle manual checkout with a provided ID.
  const handleManualCheckOut = async () => {
    if (!manualId.trim()) {
      setMessage("❌ Please enter a valid ID.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.get<QrCodeResponse>(
        `https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/${manualId}/checkout-id`
      );
      console.log(response)
      if (response.status === 200) {
        setUserName("Visitor");
        setMessage(`✅ ${response.data}`);
      } else {
        setMessage(` ${response.data}`);
      }
    } catch (error) {
      console.error("Error during manual checkout:", error);
      setMessage("❌ System error, please try again.");
    } finally {
      setLoading(false);
      setManualId("");
    }
  };

  return (
    <Row justify="center" style={{ padding: "24px" }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card
          title={<Title level={3}>🚪 Auto Checkout</Title>}
          bordered={false}
          style={{ textAlign: "center" }}
        >
          <Text type="secondary">Place QR Code within view to auto-scan:</Text>
          <div style={{ position: "relative", marginTop: "16px" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{ facingMode: "environment" }}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          {loading && (
            <div style={{ marginTop: "16px" }}>
              <Spin tip="Processing..." />
            </div>
          )}

          {qrCode && (
            <Alert
              message={`Scanned QR Code: ${qrCode}`}
              type="info"
              showIcon
              style={{ marginTop: "16px" }}
            />
          )}

          {message && (
            <Alert
              message={message}
              type={message.includes("✅") ? "success" : "error"}
              showIcon
              style={{ marginTop: "16px" }}
            />
          )}

          <div style={{ marginTop: "24px", textAlign: "left" }}>
            <Title level={4}>Manual Checkout</Title>
            <Input
              placeholder="Enter ID Number"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              prefix={<IdcardOutlined />}
            />
            <Button
              type="primary"
              onClick={handleManualCheckOut}
              block
              style={{ marginTop: "16px" }}
            >
              Checkout Manually
            </Button>
          </div>

          <div style={{ marginTop: "24px" }}>
            <Button
              type="default"
              icon={<SyncOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AutoCheckOut;

function timeout(callback: () => void, delay: number) {
  setTimeout(callback, delay);
}

