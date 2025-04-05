import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, notification } from "antd";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visitorType: string;
  purpose: string;
  company?: string;
  idVerification: string;
  host: string;
  status: "Pre-registered" | "Not Logged In" | "Logged In (Manual)" | "Logged In (QR Code)" | "Checked Out";
  checkInTime?: string;
  checkOutTime?: string;
  image?: string;
  qrCode?: string;
}

const { Option } = Select;

const VisitorManagement: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>({});
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVisitors();
  }, [newVisitor]);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://backend-lingering-flower-8936.fly.dev/api/v1/visitor");
      const data = await response.json();
      setVisitors(data);
    } catch (error) {
      notification.error({ message: "Error fetching visitors", description: "Unable to fetch visitor data." });
    }
    setLoading(false);
  };

  const handleCheckIn = async (id: string, method: "Manual" | "QR Code") => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: `Logged In (${method})`, checkInTime: new Date().toLocaleString() } : v
      )
    );
    await fetch(`https://backend-lingering-flower-8936.fly.dev/v1/api/visitor/manual-checkin`, { method: "POST", body: JSON.stringify({ method }) });
  };

  const handleCheckOut = async (id: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "Checked Out", checkOutTime: new Date().toLocaleString() } : v
      )
    );
    await fetch(`https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/${id}/checkout`, { method: "POST" });
  };

  const handleAddVisitor = async (values: any) => {
    const newVisitorData = { ...values, id: String(visitors.length + 1), status: "Pre-registered" } as Visitor;
    setVisitors([...visitors, newVisitorData]);
    setNewVisitor({});
    setShowForm(false);
    await fetch("https://b3a7-102-213-241-210.ngrok-free.app/api/v1/visitors", { method: "POST", body: JSON.stringify(newVisitorData) });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (image: string) => <img src={image || "https://i.pravatar.cc/100"} alt="Visitor" className="w-12 h-12 rounded-full" />,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: "Check-In Time",
      dataIndex: "checkInTime",
      render: (time: string) => time || "-",
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOutTime",
      render: (time: string) => time || "-",
    },
    {
      title: "Actions",
      render: (_: any, record: Visitor) => (
        <div>
          {record.status === "Pre-registered" && (
            <Button onClick={() => handleCheckIn(record.id, "Manual")} type="primary" size="small" className="mr-2">
              Check In
            </Button>
          )}
          {record.status.startsWith("Logged In") && !record.checkOutTime && (
            <Button onClick={() => handleCheckOut(record.id)} type="default" size="small">
              Check Out
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen mt-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">Visitor Management</h1>
      <Button type="primary" onClick={() => setShowForm(true)} className="mb-4">
        + Add Visitor
      </Button>

      <Table
        columns={columns}
        dataSource={visitors}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />

      <Modal
        title="Add New Visitor"
        visible={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddVisitor}
          initialValues={{ visitorType: "Guest" }}
        >
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter the visitor's name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter the phone number" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Purpose" name="purpose" rules={[{ required: true, message: "Please enter the purpose of the visit" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Visitor Type" name="visitorType">
            <Select>
              <Option value="Guest">Guest</Option>
              <Option value="Contractor">Contractor</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Check-In Time" name="checkInTime">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="Check-Out Time" name="checkOutTime">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorManagement;
