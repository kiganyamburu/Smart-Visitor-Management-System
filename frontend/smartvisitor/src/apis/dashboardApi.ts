import axios from "axios";

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get("https://backend-lingering-flower-8936.fly.dev/api/v1/utils", {
      headers: { Accept: "application/json" },
    });
    console.log("Dashboard stats response:", response.data);
    return response.data; // Replace with your real API
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    
    // Return dummy data if API call fails
    return {
      totalEmployees: 25,
      totalVisitors: 150,
      totalPreRegisters: 40,
      maleVisitors: 80,
      femaleVisitors: 55,
      otherVisitors: 15,
      peakHours: [
        { _id: "06", count: 5 },
        { _id: "07", count: 8 },
        { _id: "08", count: 15 },
        { _id: "09", count: 20 },
        { _id: "10", count: 30 },
        { _id: "11", count: 35 },
        { _id: "12", count: 45 },
        { _id: "13", count: 25 },
        { _id: "14", count: 40 },
        { _id: "15", count: 50 },
        { _id: "16", count: 55 },
        { _id: "17", count: 60 },
        { _id: "18", count: 35 },
        { _id: "19", count: 20 },
      ],
    };
  }
};
