import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LoginOutlined,
  EditOutlined,
  HomeOutlined,
  IdcardOutlined,
  FileTextOutlined,
  UserAddOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Button, Typography, Row, Col, Card } from "antd";
import CheckInOverview from "./CheckInOverview";
import ACheckIn from "./AutoCheckIn";
import MCheckIn from "./ManualCheckIn";
import GCheckIn from "./GuestCheckIn";
import SCheckIn from "./StaffCheckIn";
import VLog from "./Autocheckout";
import PreRegister from "./PreRegistration";

const { Title, Text } = Typography;

const AutoCheckIn = () => <ACheckIn />;
const ManualCheckIn = () => <MCheckIn />;
const GuestCheckIn = () => <GCheckIn />;
const StaffCheckIn = () => <SCheckIn />;
const VisitorLog = () => <VLog />;
const HelpCenter = () => <PreRegister />;

interface CheckInButtonProps {
  label: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ label, icon, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <Card
      hoverable
      style={{
        backgroundColor: color,
        color: "white",
        textAlign: "center",
        borderRadius: 12, // slightly smaller radius
        padding: 0, // remove internal card padding
      }}
      bodyStyle={{ padding: 12 }} // minimal body padding
    >
      <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
      <Text strong style={{ color: "white", fontSize: 13 }}>{label}</Text>
    </Card>
  </motion.div>
);

export default function Management() {
  const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 16, // reduced from 24 to 8 for minimal padding
        maxWidth: 800,
        margin: "0 auto",
        background: "#fff",
      }}
    >
      {/* Header with smaller bottom margin */}
      <header style={{ textAlign: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Display Board</Title>
      </header>

      <AnimatePresence mode="wait">
        {activeComponent ? (
          <motion.div
            key="activeComponent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 16 }}
          >
            {/* Back button with minimal spacing */}
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => setActiveComponent(null)}
              style={{ marginBottom: 8, fontWeight: 600, padding: 0 }}
            >
              Back
            </Button>
            <div>{activeComponent}</div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Row gutter={[20, 20]} justify="center">
              <Col xs={12} md={8}>
                <CheckInButton
                  label="Auto Check-In"
                  icon={<LoginOutlined />}
                  color="#1677ff"
                  onClick={() => setActiveComponent(<AutoCheckIn />)}
                />
              </Col>
              <Col xs={12} md={8}>
                <CheckInButton
                  label="Manual Check-In"
                  icon={<EditOutlined />}
                  color="#10b981"
                  onClick={() => setActiveComponent(<ManualCheckIn />)}
                />
              </Col>
              <Col xs={12} md={8}>
                <CheckInButton
                  label="Guest Check-In"
                  icon={<HomeOutlined />}
                  color="#facc15"
                  onClick={() => setActiveComponent(<GuestCheckIn />)}
                />
              </Col>
              <Col xs={12} md={8}>
                <CheckInButton
                  label="Staff Check-In"
                  icon={<IdcardOutlined />}
                  color="#6b7280"
                  onClick={() => setActiveComponent(<StaffCheckIn />)}
                />
              </Col>
              <Col xs={12} md={8}>
                <CheckInButton
                  label="Check Out"
                  icon={<FileTextOutlined />}
                  color="#14b8a6"
                  onClick={() => setActiveComponent(<VisitorLog />)}
                />
              </Col>
              <Col xs={12} md={8}>
                <CheckInButton
                  label="Pre Register"
                  icon={<UserAddOutlined />}
                  color="#ef4444"
                  onClick={() => setActiveComponent(<HelpCenter />)}
                />
              </Col>
            </Row>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview with tighter margin */}
      <div style={{ marginTop: 24 }}>
        <CheckInOverview />
      </div>
    </div>
  );
}
