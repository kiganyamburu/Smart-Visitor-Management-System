import React, { useEffect, useState } from "react";
import { Table, Input, DatePicker, Row, Col, Card, Statistic, Button, Alert, Spin } from "antd";
import { CSVLink } from "react-csv";
import moment from "moment";
import { FaDownload, FaExclamationTriangle } from "react-icons/fa";
import dummyVisitors from "../../apis/Dummy"; // Dummy data in case of errors

interface Visitor {
  id: string;
  name: string;
  phone: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "Checked In" | "Checked Out";
  location?: string;
  host: string;
}

const AttendanceDashboard: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVisitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const response = await fetch(`http://localhost:3000/api/visitors?date=${dateStr}`);
      const data = await response.json();
      setVisitors(data);
      setFilteredVisitors(data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setVisitors(dummyVisitors);
      setFilteredVisitors(dummyVisitors);
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const query = value.toLowerCase();
    setFilteredVisitors(visitors.filter(visitor => visitor.name.toLowerCase().includes(query)));
  };

  const exportData = [
    ["Name", "Phone", "Check-in Time", "Check-out Time", "Status", "Location", "Host"],
    ...visitors.map(visitor => [
      visitor.name,
      visitor.phone,
      visitor.checkInTime || "N/A",
      visitor.checkOutTime || "N/A",
      visitor.status,
      visitor.location || "N/A",
      visitor.host,
    ]),
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Check-In Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (time: string) => time || "-",
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (time: string) => time || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{ color: status === "Checked In" ? "#52c41a" : "#f5222d" }}>{status}</span>
      ),
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#1890ff" }}>
        Attendance Dashboard
      </h1>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Total Visitors Today" value={visitors.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="Checked-In Visitors"
              value={visitors.filter(v => v.status === "Checked In").length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic title="Avg Visit Duration" value="45 min" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Frequent Hosts" value="John, Jane, Alex" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Visitors by Location" value="3 Offices" />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Input.Search
            placeholder="Search visitor..."
            value={searchQuery}
            onSearch={handleSearch}
            onChange={e => handleSearch(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            size="large"
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={4} md={4}>
          <CSVLink data={exportData} filename={`attendance_${selectedDate.format("YYYY-MM-DD")}.csv`}>
            <Button type="primary" size="large" icon={<FaDownload />} block>
              Export CSV
            </Button>
          </CSVLink>
        </Col>
      </Row>

      {/* Attendance Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredVisitors}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      )}

      {/* Alerts */}
      <div style={{ marginTop: 24 }}>
        <Alert
          message="Security Alert"
          description="🚨 Security Alert: 2 visitors checked in but not checked out!"
          type="error"
          showIcon
          icon={<FaExclamationTriangle style={{ color: "#ff4d4f" }} />}
        />
      </div>
    </div>
  );
};

export default AttendanceDashboard;
