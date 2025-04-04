interface Visitor {
    id: string;
    name: string;
    phone: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: "Checked In" | "Checked Out";
    location?: string;
    staff: string;
  }
  
export const dummyGraphData = [
    { date: "2024-03-01", type: "Guest", count: 50, location: "Main Gate" },
    { date: "2024-03-02", type: "Employee", count: 75, location: "Back Gate" },
    { date: "2024-03-03", type: "Contractor", count: 20, location: "Main Gate" },
    { date: "2024-03-04", type: "Guest", count: 40, location: "Reception" },
    { date: "2024-03-05", type: "Employee", count: 80, location: "Office Entrance" },
    { date: "2024-03-06", type: "Guest", count: 60, location: "Lobby" },
    { date: "2024-03-07", type: "Contractor", count: 25, location: "Warehouse" },
    { date: "2024-03-08", type: "Guest", count: 35, location: "Reception" },
    { date: "2024-03-09", type: "Employee", count: 95, location: "Main Gate" },
    { date: "2024-03-10", type: "Guest", count: 70, location: "Main Gate" },
  ];
  
  export const dummyPieChartData = [
    { type: "Guest", count: 450 },
    { type: "Employee", count: 600 },
    { type: "Contractor", count: 150 },
  ];
  
  export const dummyCheckInOutData = [
    { name: "John Doe", type: "Guest", location: "Main Gate", date: "2024-03-01" },
    { name: "Alice Brown", type: "Employee", location: "Back Gate", date: "2024-03-02" },
    { name: "Michael Smith", type: "Contractor", location: "Warehouse", date: "2024-03-03" },
    { name: "Sophia Johnson", type: "Guest", location: "Reception", date: "2024-03-04" },
    { name: "David Lee", type: "Employee", location: "Office Entrance", date: "2024-03-05" },
  ];
  
  export const dummyFrequentVisitors = [
    { name: "John Doe", type: "Guest", visits: 15 },
    { name: "Alice Brown", type: "Employee", visits: 30 },
    { name: "Michael Smith", type: "Contractor", visits: 10 },
    { name: "Sophia Johnson", type: "Guest", visits: 12 },
    { name: "David Lee", type: "Employee", visits: 50 },
  ];
  
  export const dummyAlerts = [
    { alert: "Unauthorized access detected at Warehouse", date: "2024-03-01" },
    { alert: "Visitor overstayed at Reception", date: "2024-03-03" },
    { alert: "Suspicious activity at Main Gate", date: "2024-03-05" },
    { alert: "Employee access denied at Office Entrance", date: "2024-03-07" },
  ];
  
  export const dummyHeatMapData = [
    { location: "Main Gate", count: 200 },
    { location: "Reception", count: 150 },
    { location: "Office Entrance", count: 180 },
    { location: "Warehouse", count: 100 },
    { location: "Lobby", count: 120 },
  ];
  
  const dummyVisitors: Visitor[] = [
    {
      id: "1",
      name: "Alice Johnson",
      phone: "254712345678",
      checkInTime: "08:30 AM",
      checkOutTime: "11:00 AM",
      status: "Checked Out",
      location: "Office 1",
      staff: "John Doe"
    },
    {
      id: "2",
      name: "Bob Smith",
      phone: "254798765432",
      checkInTime: "09:15 AM",
      checkOutTime: "12:30 PM",
      status: "Checked Out",
      location: "Office 2",
      staff: "Jane Doe"
    },
    {
      id: "3",
      name: "Charlie Brown",
      phone: "254723456789",
      checkInTime: "10:00 AM",
      checkOutTime: undefined,
      status: "Checked In",
      location: "Office 3",
      staff: "Alex Kim"
    },
    {
      id: "4",
      name: "Diana Prince",
      phone: "254711223344",
      checkInTime: "10:45 AM",
      checkOutTime: undefined,
      status: "Checked In",
      location: "Office 1",
      staff: "Bruce Wayne"
    },
    {
      id: "5",
      name: "Ethan Hunt",
      phone: "254733445566",
      checkInTime: "11:30 AM",
      checkOutTime: "01:15 PM",
      status: "Checked Out",
      location: "Office 2",
      staff: "James Bond"
    },
    {
      id: "6",
      name: "Fiona Gallagher",
      phone: "254788990011",
      checkInTime: "12:00 PM",
      checkOutTime: undefined,
      status: "Checked In",
      location: "Office 3",
      staff: "Walter White"
    },
    {
      id: "7",
      name: "George Costanza",
      phone: "254755667788",
      checkInTime: "08:45 AM",
      checkOutTime: "10:45 AM",
      status: "Checked Out",
      location: "Office 1",
      staff: "Jerry Seinfeld"
    },
    {
      id: "8",
      name: "Hannah Montana",
      phone: "254700112233",
      checkInTime: "09:30 AM",
      checkOutTime: "11:45 AM",
      status: "Checked Out",
      location: "Office 2",
      staff: "Miley Stewart"
    },
    {
      id: "9",
      name: "Ian McKellen",
      phone: "254722334455",
      checkInTime: "10:10 AM",
      checkOutTime: undefined,
      status: "Checked In",
      location: "Office 3",
      staff: "Patrick Stewart"
    },
    {
      id: "10",
      name: "Jessica Jones",
      phone: "254799887766",
      checkInTime: "11:00 AM",
      checkOutTime: "02:00 PM",
      status: "Checked Out",
      location: "Office 1",
      staff: "Luke Cage"
    }
  ];
  
  export default dummyVisitors;
  