import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Button, Modal, Form, Input, Spin, message, Typography, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, ClockCircleOutlined, UserSwitchOutlined, TeamOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const { Title, Text } = Typography;

interface Department {
  id: string;
  name: string;
  location: string;
  admins: string[];
  receptionist: string;
  operatingHours: string;
}

const dummyDepartments: Department[] = [
  {
    id: "dept-001",
    name: "Human Resources",
    location: "Building A, 3rd Floor",
    admins: ["admin1@example.com", "admin2@example.com"],
    receptionist: "receptionist1@example.com",
    operatingHours: "08:00 AM - 05:00 PM",
  },
  {
    id: "dept-002",
    name: "IT Support",
    location: "Building B, 2nd Floor",
    admins: ["admin3@example.com"],
    receptionist: "receptionist3@example.com",
    operatingHours: "09:00 AM - 06:00 PM",
  }
];

const Department = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backend-lingering-flower-8936.fly.dev/api/v1/department");
      console.log("Departments fetched:", response.data);
      setDepartments(response.data);
    } catch (error) {
      //console.error("Fetch error, loading dummy:", error);
      setDepartments(dummyDepartments);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      form.setFieldsValue(dept);
    } else {
      setEditingDept(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this department?",
      onOk: async () => {
        try {
          await axios.delete(`https://backend-lingering-flower-8936.fly.dev/api/v1/department/${id}`);
          message.success("Department deleted");
          fetchDepartments();
        } catch (err) {
          message.error("Failed to delete department");
        }
      }
    });
  };

  const handleFinish = async (values: Partial<Department>) => {
    try {
      if (editingDept) {
        await axios.put(`https://backend-lingering-flower-8936.fly.dev/api/v1/department/${editingDept.id}`, values);
        message.success("Department updated");
      } else {
        await axios.post("https://backend-lingering-flower-8936.fly.dev/api/v1/department", values);
        message.success("Department added");
      }
      fetchDepartments();
      setModalVisible(false);
    } catch (err) {
      message.error("Failed to save department");
    }
  };

  return (
    <div className="pt-8 p-6 bg-white rounded-lg shadow">
      <Space style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={4}><TeamOutlined /> Department Management</Title>
        {user?.role === "ADMIN" && (
          <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal()}>
            Add Department
          </Button>
        )}
      </Space>

      {loading ? (
        <div className="flex justify-center"><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {departments.map((dept) => (
            <Col xs={24} sm={12} lg={8} key={dept.id}>
              <Card
                title={<span><TeamOutlined /> {dept.name}</span>}
                bordered
                actions={
                  user?.role === "ADMIN"
                    ? [
                        <EditOutlined key="edit" onClick={() => openModal(dept)} />,
                        <DeleteOutlined key="delete" onClick={() => handleDelete(dept.id)} />
                      ]
                    : undefined
                }
              >
                <p><EnvironmentOutlined /> <Text strong>Location:</Text> {dept.location}</p>
                <p><ClockCircleOutlined /> <Text strong>Hours:</Text> {dept.operatingHours}</p>
                <p><UserSwitchOutlined rotate={180} /> <Text strong>Receptionist:</Text> {dept.receptionist}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editingDept ? "Edit Department" : "Add New Department"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item name="name" label="Department Name" rules={[{ required: true, message: "Enter name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: "Enter location" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="receptionist" label="receptionist" rules={[{ required: true, message: "Enter receptionsit name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="operatingHours" label="Operating Hours" rules={[{ required: true, message: "Enter hours" }]}>
            <Input placeholder="e.g., 08:00 AM - 05:00 PM" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Department;
