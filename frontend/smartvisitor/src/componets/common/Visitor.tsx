import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface Visitor {
<<<<<<< HEAD
    id: string;
    name: string;
    phone: string;
    email?: string;
    visitorType: string;
    purpose: string;
    company?: string;
    idVerification: string;
    staff: string;
    status: "Pre-registered" | "Not Logged In" | "Logged In (Manual)" | "Logged In (QR Code)" | "Checked Out";
    checkInTime?: string;
    checkOutTime?: string;
    image?: string;
    qrCode?: string;
=======
  id: string;
  name: string;
  phone: string;
  email?: string;
  visitorType: string;
  purpose: string;
  idVerification: string;
  host: string;
  status:
    | "Pre-registered"
    | "Not Logged In"
    | "Logged In (Manual)"
    | "Logged In (QR Code)"
    | "Checked Out";
  checkInTime?: string;
  checkOutTime?: string;
  image?: string;
  qrCode?: string;
  gender?: "male" | "female";
>>>>>>> 80646bbc76e2c5a9c301bdd6124a442957977d97
}

const VisitorManagement: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>({});
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVisitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVisitor]);

<<<<<<< HEAD
    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const response = await fetch("htttp://localhost:3000/api/visitors");
            const data = await response.json();
            setVisitors(data);
        } catch (error) {
            const dummyVisitors: Visitor[] = Array.from({ length: 50 }, (_, i) => ({
                id: `${i + 1}`,
                name: `Visitor ${i + 1}`,
                phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
                email: `visitor${i + 1}@example.com`,
                visitorType: i % 2 === 0 ? "Guest" : "Contractor",
                purpose: ["Meeting", "Interview", "Delivery", "Maintenance", "Training"][Math.floor(Math.random() * 5)],
                company: i % 3 === 0 ? `Company ${i + 1}` : undefined,
                idVerification: `ID${1000 + i}`,
                staff: `Host ${Math.floor(Math.random() * 10) + 1}`,
                status: ["Pre-registered", "Not Logged In", "Logged In (Manual)", "Logged In (QR Code)", "Checked Out"][Math.floor(Math.random() * 5)] as Visitor["status"],
                checkInTime: Math.random() > 0.5 ? new Date().toLocaleString() : undefined,
                checkOutTime: Math.random() > 0.7 ? new Date().toLocaleString() : undefined,
                image: `https://i.pravatar.cc/100?img=${i + 1}`,
                qrCode: `https://via.placeholder.com/100?text=QR${i + 1}`,
            }));
            
            setVisitors(dummyVisitors);
            setLoading(false);
            console.error("Error fetching visitors:", error);
        }
        setLoading(false);
    };
=======
  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend-lingering-flower-8936.fly.dev/api/v1/visitor"
      );
      const data = await response.json();
      setVisitors(data);
    } catch (error) {
      notification.error({
        message: "Error fetching visitors",
        description: "Unable to fetch visitor data.",
      });
    }
    setLoading(false);
  };
>>>>>>> 80646bbc76e2c5a9c301bdd6124a442957977d97

  const handleCheckIn = async (id: string, method: "Manual" | "QR Code") => {
    const updatedVisitors: Visitor[] = visitors.map((v) =>
      v.id === id
        ? ({
            ...v,
            status: `Logged In (${method})`,
            checkInTime: new Date().toISOString(),
          } as Visitor)
        : v
    );
    setVisitors(updatedVisitors);

    await fetch(
      `https://backend-lingering-flower-8936.fly.dev/v1/api/visitor/manual-checkin`,
      {
        method: "POST",
        body: JSON.stringify({ method }),
      }
    );
  };

  const handleCheckOut = async (id: string) => {
    const updatedVisitors: Visitor[] = visitors.map((v) =>
      v.id === id
        ? ({
            ...v,
            status: "Checked Out",
            checkOutTime: new Date().toISOString(),
          } as Visitor)
        : v
    );
    setVisitors(updatedVisitors);

    await fetch(
      `https://backend-lingering-flower-8936.fly.dev/api/v1/visitor/${id}/checkout`,
      {
        method: "POST",
      }
    );
  };

  const handleAddVisitor = async (values: any) => {
    const newVisitorData = {
      ...values,
      id: String(visitors.length + 1),
      status: "Pre-registered",
    } as Visitor;

    // Set default image based on gender selection
    if (values.gender === "male") {
      newVisitorData.image = "https://randomuser.me/api/portraits/men/1.jpg";
    } else if (values.gender === "female") {
      newVisitorData.image = "https://randomuser.me/api/portraits/women/1.jpg";
    } else {
      newVisitorData.image = "https://i.pravatar.cc/100";
    }

    setVisitors([...visitors, newVisitorData]);
    setNewVisitor({});
    setShowForm(false);

    await fetch(
      "https://backend-lingering-flower-8936.fly.dev/api/v1/visitors",
      {
        method: "POST",
        body: JSON.stringify(newVisitorData),
      }
    );
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (image: string) => (
        <img
          src={image || "https://i.pravatar.cc/100"}
          alt="Visitor"
          className="w-12 h-12 rounded-full"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email?: string) => email || "-",
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
      title: "Gender",
      dataIndex: "gender",
      render: (gender?: string) => gender || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <span>{status}</span>,
    },
    {
      title: "Check-In Time",
      dataIndex: "checkInTime",
      render: (time?: string) =>
        time ? dayjs(time).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOutTime",
      render: (time?: string) =>
        time ? dayjs(time).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "Actions",
      render: (_: any, record: Visitor) => (
        <div>
          {record.status === "Pre-registered" && (
            <Button
              onClick={() => handleCheckIn(record.id, "Manual")}
              type="primary"
              size="small"
              className="mr-2"
            >
              Check In
            </Button>
          )}
          {record.status.startsWith("Logged In") && !record.checkOutTime && (
            <Button
              onClick={() => handleCheckOut(record.id)}
              type="default"
              size="small"
            >
              Check Out
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen mt-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">
        Visitor Management
      </h1>
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
        open={showForm}
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
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter the visitor's name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Purpose"
            name="purpose"
            rules={[{ required: true, message: "Please enter the purpose of the visit" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Visitor Type" name="visitorType">
            <Select>
              <Option value="Guest">Guest</Option>
              <Option value="Contractor">Contractor</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please select a gender" }]}>
            <Select placeholder="Select Gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
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
