import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Alert,
  Button,
  Spin,
  List,
} from "antd";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
} from "chart.js";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { fetchDashboardStats } from "../../apis/dashboardApi";
import type { ColumnsType } from "antd/es/table";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle
);

const { Title } = Typography;

interface Visitor {
  id: string;
  name: string;
  role: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  qrCode?: string;
}

interface VisitorStats {
  totalEmployee: number;
  totalVisitors: number;
  totalPreRegister: number;
  maleVisitors: number;
  femaleVisitors: number;
  otherVisitors: number;
  peakHours: { _id: string; count: number }[];
  visitorTypes: { type: string; count: number }[];
  recentVisitors: Visitor[];
}

const DashboardContent: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchStats();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: VisitorStats = await fetchDashboardStats();
      if (!isMounted.current) return;
      setStats(data);
    } catch (e: any) {
      console.error("Fetch error:", e.response?.data || e.message || e);
      setError("Failed to fetch visitor data. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const pieData = useMemo(() => ({
    labels: ["Male", "Female", "Other"],
    datasets: [{
      data: [
        stats?.maleVisitors || 0,
        stats?.femaleVisitors || 0,
        stats?.otherVisitors || 0,
      ],
      backgroundColor: ["#1890ff", "#eb2f96", "#faad14"],
    }],
  }), [stats]);

  // Define chart options for a smaller chart
  const pieOptions = useMemo(() => ({
    maintainAspectRatio: false,
    responsive: true,
  }), []);

  const lineData = useMemo(() => {
    const hours = Array.isArray(stats?.peakHours) ? stats.peakHours : [];
    return {
      labels: hours.map(h => `${h._id}:00`),
      datasets: [{
        label: "Visitors Per Hour",
        data: hours.map(h => h.count),
        borderColor: "#52c41a",
        fill: false,
      }],
    };
  }, [stats]);

  const columns: ColumnsType<Visitor> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "role", key: "role" },
    {
      title: "QR Code",
      dataIndex: "qrCode",
      key: "qrCode",
      render: (value: string) => value ? (
        <img
          src={`data:image/png;base64,${value}`}
          alt="QR Code"
          style={{ width: 50, height: 50 }}
        />
      ) : "N/A",
    },
    {
      title: "Check-In",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (value: string | null) => value
        ? dayjs(value).format("MMM DD, YYYY HH:mm")
        : "N/A",
    },
    {
      title: "Check-Out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (value: string | null) => value
        ? dayjs(value).format("MMM DD, YYYY HH:mm")
        : "N/A",
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spin tip="Loading dashboard..." size="large">
          <div style={{ height: 100 }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={<Button onClick={fetchStats}>Retry</Button>}
      />
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Title level={3}>Dashboard Overview</Title>
        </Col>

        {/* Stats Cards */}
        <Col xs={24} sm={8}>
          <Card title="Total Employees" variant="outlined">
            <Title level={2}>{stats?.totalEmployee}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="Total Visitors" variant="outlined">
            <Title level={2}>{stats?.totalVisitors}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card title="Pre-Registered Visitors" variant="outlined">
            <Title level={2}>{stats?.totalPreRegister}</Title>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Gender Breakdown" variant="outlined">
            <div style={{ height: "200px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Peak Check-In Hours" variant="outlined">
            <Line data={lineData} />
          </Card>
        </Col>

        {/* Visitor Types */}
        <Col xs={24}>
          <Card title="Visitor Types Breakdown" variant="outlined">
            <List
              dataSource={stats?.visitorTypes || []}
              renderItem={(item) => (
                <List.Item>
                  <span>{item.type}</span>: <strong>{item.count}</strong>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Visitors */}
        <Col xs={24}>
          <Card title="Recent Visitors" variant="outlined">
            <Table
              columns={columns}
              dataSource={stats?.recentVisitors || []}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: "100%" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
