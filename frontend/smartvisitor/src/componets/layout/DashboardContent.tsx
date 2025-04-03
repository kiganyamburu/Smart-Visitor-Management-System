import { useState, useEffect, useMemo, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import { fetchDashboardStats } from "../../apis/dashboardApi";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface Visitor {
  id: string;
  name: string;
  type: string;
  checkIn: string;
  checkOut?: string;
}

interface VisitorStats {
  totalEmployees: number;
  totalVisitors: number;
  totalPreRegisters: number;
  maleVisitors: number;
  femaleVisitors: number;
  otherVisitors: number;
  peakHours: { _id: string; count: number }[];
  visitorTypes: { type: string; count: number }[];
  recentVisitors: Visitor[];
}

const DashboardContent = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchStats();

    return () => {
      isMounted.current = false; // Cleanup on unmount
    };
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();

      if (!isMounted.current) return;

      if (data && typeof data === "object") {
        setStats(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to fetch visitor data. Please check your internet connection.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // Extract visitor stats safely
  const totalEmployees = stats?.totalEmployees ?? 0;
  const totalVisitors = stats?.totalVisitors ?? 0;
  const totalPreRegisters = stats?.totalPreRegisters ?? 0;
  const maleVisitors = stats?.maleVisitors ?? 0;
  const femaleVisitors = stats?.femaleVisitors ?? 0;
  const otherVisitors = stats?.otherVisitors ?? 0;
  const peakHours = stats?.peakHours ?? [];
  const visitorTypes = stats?.visitorTypes ?? [];
  const recentVisitors = stats?.recentVisitors ?? [];

  // Memoized chart data
  const pieData = useMemo(() => ({
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [maleVisitors, femaleVisitors, otherVisitors],
        backgroundColor: ["#3498db", "#e74c3c", "#f1c40f"],
      },
    ],
  }), [maleVisitors, femaleVisitors, otherVisitors]);

  const lineData = useMemo(() => ({
    labels: peakHours.map(h => `${h._id}:00`),
    datasets: [
      {
        data: peakHours.map(h => h.count),
        label: "Visitors Per Hour",
        borderColor: "#2ecc71",
        fill: false,
      },
    ],
  }), [peakHours]);

  if (loading) return <p className="text-center text-gray-600">Loading visitor data...</p>;

  if (error) return (
    <div className="text-center text-red-600">
      <p>{error}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2" onClick={fetchStats}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Employees" value={totalEmployees} color="bg-red-500" />
        <StatCard title="Total Visitors" value={totalVisitors} color="bg-blue-500" />
        <StatCard title="Total Pre Registers" value={totalPreRegisters} color="bg-yellow-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Visitor Gender Breakdown">
          <div className="w-64 h-64 mx-auto">
            <Pie data={pieData} />
          </div>
        </ChartCard>


        <ChartCard title="Peak Check-In Hours">
          <Line data={lineData} />
        </ChartCard>
      </div>

      {/* Visitor Type Breakdown */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Visitor Types Breakdown</h2>
        <ul className="list-disc ml-5 text-gray-600">
          {visitorTypes.map((type, index) => (
            <li key={index} className="text-md">{type.type}: {type.count}</li>
          ))}
        </ul>
      </div>

      {/* Recent Visitors */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Visitors</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Type</th>
              <th className="border border-gray-200 px-4 py-2">Check-In</th>
              <th className="border border-gray-200 px-4 py-2">Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {recentVisitors.map(visitor => (
              <tr key={visitor.id} className="text-center">
                <td className="border border-gray-200 px-4 py-2">{visitor.name}</td>
                <td className="border border-gray-200 px-4 py-2">{visitor.type}</td>
                <td className="border border-gray-200 px-4 py-2">{visitor.checkIn}</td>
                <td className="border border-gray-200 px-4 py-2">{visitor.checkOut ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;

/* 🟢 Reusable Components 🟢 */
interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

const StatCard = ({ title, value, color }: StatCardProps) => (
  <div className="bg-white p-4 shadow-lg rounded-lg flex items-center gap-4">
    <div className={`${color} text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold`}>
      {value}
    </div>
    <div>
      <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
      <p className="text-gray-500">{value}</p>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="bg-white p-6 shadow-lg rounded-lg">
    <h2 className="text-lg font-semibold text-gray-700 mb-3">{title}</h2>
    {children}
  </div>
);
