import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#001529", padding: "20px 50px" }}>
      <div style={{ marginBottom: 8 }}>
        <Text style={{ color: "#fff", fontSize: 14 }}>
          © {new Date().getFullYear()} Smart Visitor Management System. All rights reserved.
        </Text>
      </div>
      <div>
        <Text style={{ color: "#fff", fontSize: 12 }}>
          Crafted with <span role="img" aria-label="love">❤️</span> using Ant Design & React.
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter;
