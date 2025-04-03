import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { dummyGraphData } from "../../apis/Dummy";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const Reports: React.FC = () => {
  const [data, setData] = useState<any[]>(dummyGraphData);
  const [filteredData, setFilteredData] = useState<any[]>(dummyGraphData);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState("daily");

  useEffect(() => {
    axios.get("http://localhost:3000/api/reports")
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        setData(dummyGraphData);
      });
  }, []);

  useEffect(() => {
    let filtered = data;
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const visitDate = new Date(item.date);
        return visitDate >= startDate && visitDate <= endDate;
      });
    }
    setFilteredData(filtered);
  }, [startDate, endDate, data]);

  const handleFilterChange = () => {
    axios.get(`http://localhost:3000/api/reports?type=${reportType}`)
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch(() => {
        setFilteredData(dummyGraphData);
      });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Visitor Reports", 14, 10);
    autoTable(doc, {
      head: [["Name", "Type", "Location", "Date"]],
      body: filteredData.map((item) => [item.name, item.type, item.location, item.date]),
    });
    doc.save("reports.pdf");
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Visitor Reports</h2>

      <div className="flex gap-4 mb-4">
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Start Date" className="border p-2 rounded" />
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="End Date" className="border p-2 rounded" />
        <select onChange={(e) => setReportType(e.target.value)} className="border p-2 rounded">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button onClick={handleFilterChange} className="p-2 bg-green-500 text-white rounded">Apply Filter</button>
      </div>

      <div className="flex gap-4 mb-4">
        <CSVLink data={filteredData} filename="reports.csv" className="p-2 bg-blue-500 text-white rounded">Export CSV</CSVLink>
        <button onClick={exportPDF} className="p-2 bg-red-500 text-white rounded">Export PDF</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold text-gray-700">Visitor Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={filteredData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100}>
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold text-gray-700">Check-in & Check-out Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow mt-6">
        <h3 className="text-lg font-bold text-gray-700">Frequent Visitors Report</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#4caf50" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;