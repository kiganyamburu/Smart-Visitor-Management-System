import React, { useRef, useState, useEffect, useContext } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Card, Button, Spin, Alert } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { DepartmentContext } from "../../contexts/DepartmentContext";

interface User {
  name: string;
  department: string;
}

interface QrCodeResponse {
  code: string;
  valid: boolean;
  name?: User;
}
const AutoCheckIn: React.FC = () => {
  const { department } = useContext(DepartmentContext);
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const scanningIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    startScanning();
    return stopScanning;
  }, []);

  const startScanning = () => {
    if (scanningIntervalRef.current !== null) return; // already scanning
    scanningIntervalRef.current = window.setInterval(scanFrame, 500);
  };

  const stopScanning = () => {
    if (scanningIntervalRef.current !== null) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (qrCode && !loading) {
      stopScanning(); // stop scan temporarily
      setMessageText(null);
      checkInUser(qrCode);
    }
  }, [qrCode]);

  const scanFrame = () => {
    setMessageText(null);
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
      const qrCodeData = jsQR(imageData.data, img.width, img.height);
      if (qrCodeData) {
        setQrCode(qrCodeData.data);
      }
    };
  };

  const checkInUser = async (urlcode: string): Promise<void> => {
    setLoading(true);
    setMessageText(null);

    try {
      const response = await fetch(`${urlcode}/checkin`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data: QrCodeResponse = await response.json();
        setMessageText(`✅ Welcome, ${data.name}! You just Checked-In to ${department} department.`);
      } else {
        setMessageText(`❌ Invalid QR code or already checked in.`);
      }
    } catch (error) {
      console.error("Error checking in:", error);
      setMessageText("❌ System error, please try again.");
    } finally {
      setLoading(false);
      timeout(() => {
        setQrCode("");       // Clear scanned code
        setMessageText(null); // Optional
        startScanning();     // 🔁 Restart scanning
      }, 7000); // Delay before resuming scan
    }
  };


  return (
    <Card
      title="Auto Check-In"
      style={{ maxWidth: 600, margin: "20px auto", textAlign: "center" }}
      headStyle={{ background: "#f0f2f5", fontWeight: "bold" }}
    >
      <p style={{ marginBottom: 16, color: "#595959" }}>
        Place QR Code in view to auto-scan:
      </p>
      <div style={{ position: "relative" }}>
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {loading && (
        <div style={{ marginTop: 16 }}>
          <Spin size="large" tip="Processing..." />
        </div>
      )}

      {qrCode && (
        <Alert
          style={{ marginTop: 16 }}
          message={`Scanned QR Code: ${qrCode}`}
          type="info"
          showIcon
        />
      )}

      {messageText && (
        <Alert
          style={{ marginTop: 16 }}
          message={messageText}
          type={messageText.includes("✅") ? "success" : "error"}
          icon={
            messageText.includes("✅") ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          showIcon
        />
      )}

      <div style={{ marginTop: 24 }}>
        <Button
          type="default"
          icon={<SyncOutlined />}
          onClick={() => window.location.reload()}
        >
          Refresh Scanner
        </Button>
      </div>
    </Card>
  );
};

export default AutoCheckIn;

function timeout(callback: () => void, delay: number) {
  setTimeout(callback, delay);
}