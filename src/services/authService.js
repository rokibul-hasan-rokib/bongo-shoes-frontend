import { API_BASE } from "./api";
const BASE_URL = `${API_BASE}/auth`;

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logoutUser = async (token) => {
  try {
    await fetch(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getUserProfile = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/customer/profile/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) return await res.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
  }
};

export const updateUserProfile = async (token, data) => {
  try {
    const res = await fetch(`${BASE_URL}/customer/profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (error) {
    console.error("Profile update error:", error);
  }
};



export const signupUser = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      // API returns 400 or validation error
      return { error: data?.email || data?.password1 || data?.detail || "Signup failed!" };
    }
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Signup failed due to network error!" };
  }
};
