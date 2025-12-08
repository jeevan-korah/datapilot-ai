const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/users";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  verified?: boolean;
}

export interface SignupData {
  email: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  verified: boolean;
}

export interface LoginData extends UserData {
  token: string;
}

export const authAPI = {
  async signup(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<SignupData>> {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    return data;
  },

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<LoginData>> {
    const res = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "OTP verification failed");
    return data;
  },

  async resendOtp(email: string): Promise<ApiResponse<SignupData>> {
    const res = await fetch(`${API_BASE_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Resend OTP failed");
    return data;
  },

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<LoginData>> {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      // If user is not verified, return the data without throwing
      if (res.status === 403 && data.verified === false) {
        return data;
      }
      throw new Error(data.message || "Login failed");
    }

    return data;
  },
};

export const storageUtils = {
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  setUser(user: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },

  clearAuth() {
    this.removeToken();
    this.removeUser();
  },
};
