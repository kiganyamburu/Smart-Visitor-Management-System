import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../apis/authApi";
import logo from "../assets/smlogo.png";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Alert,
  Layout,
  Space,
  Card,
  Divider,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await loginAdmin(values.email, values.password);
      setMessage({ text: "Login successful!", type: "success" });
      localStorage.setItem("token", response.jwtToken);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      setMessage({ text: "Invalid credentials. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Row style={{ flex: 1 }}>
        {/* Left branding panel */}
        <Col
          xs={0}
          md={12}
          style={{
            backgroundColor: "#008080",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 40px",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "200px",
              marginBottom: 32,
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />
          <Title style={{ color: "#fff", textAlign: "center" }} level={2}>
            Welcome to Smart Visitor System
          </Title>
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              maxWidth: 420,
              fontSize: 16,
              marginTop: 16,
              lineHeight: 1.7,
            }}
          >
            Manage your visitors efficiently and securely with our intuitive platform.
          </Text>
        </Col>

        {/* Right login form */}
        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "48px 24px",
            background: "#f5f7fa",
          }}
        >
          <Content style={{ width: "100%", maxWidth: 420 }}>
            <Card
              bordered={false}
              style={{
                padding: "32px 24px",
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                background: "#fff",
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#008080", marginBottom: 0 }}>
                    Admin Login
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Enter your credentials to continue
                  </Text>
                </div>

                {message && (
                  <Alert
                    message={message.text}
                    type={message.type}
                    showIcon
                    style={{ marginTop: 4 }}
                  />
                )}

                <Form form={form} layout="vertical" onFinish={handleLogin}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "Invalid email format" },
                    ]}
                  >
                    <Input size="large" placeholder="admin@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                  >
                    <Input.Password size="large" placeholder="••••••••" />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      disabled={loading}
                    >
                      {loading ? <LoadingOutlined spin /> : "Log In"}
                    </Button>
                  </Form.Item>
                </Form>

                <div style={{ textAlign: "center", fontSize: 13, marginTop: 8 }}>
                  <a href="/forgot-password" style={{ color: "#008080" }}>
                    Forgot Username?
                  </a>{" "}
                  |{" "}
                  <a href="/register" style={{ color: "#008080" }}>
                    Register
                  </a>
                </div>

                <Divider style={{ margin: "24px 0 12px" }} />

                <footer style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
                  <p>
                    Powered by{" "}
                    <span style={{ color: "#008080", fontWeight: 500 }}>
                      Smart Visitor System
                    </span>
                  </p>
                  <p>
                    <a href="/terms" style={{ color: "#999" }}>
                      Terms
                    </a>{" "}
                    |{" "}
                    <a href="/privacy" style={{ color: "#999" }}>
                      Privacy
                    </a>
                  </p>
                </footer>
              </Space>
            </Card>
          </Content>
        </Col>
      </Row>
    </Layout>
  );
};

export default AdminLogin;
