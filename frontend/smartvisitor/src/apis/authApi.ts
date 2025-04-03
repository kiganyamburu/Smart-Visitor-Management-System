import axios from "axios";

const API_BASE_URL = "https://backend-lingering-flower-8936.fly.dev/api/v1"; // Replace with your actual backend URL

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Login failed. Please try again.";
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error resetting password.";
  }
};

export const registerAdmin = async (adminData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
    authorities: { authority: string }[];
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/register`, adminData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed!";
    }
  };
