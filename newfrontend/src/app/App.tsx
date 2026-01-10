import { useState, useEffect } from "react";
import { AuthPage } from "./components/AuthPage";
import { AdminRegistration } from "./components/AdminRegistration";
import { UserRegistration } from "./components/UserRegistration";
import { OTPVerification } from "./components/OTPVerification";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { authService } from "./services/authService";
import { User, PendingUser, Page } from "./types";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("auth");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = authService.getUsers();
    const savedCompanies = authService.getCompanies();
    const savedCurrentUser = authService.getCurrentUser();

    setUsers(savedUsers);
    setCompanies(savedCompanies);

    if (savedCurrentUser) {
      setCurrentUser(savedCurrentUser);
      setCurrentPage("dashboard");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    authService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    authService.saveCompanies(companies);
  }, [companies]);

  useEffect(() => {
    authService.saveCurrentUser(currentUser);
  }, [currentUser]);

  const handleLogin = (email: string, password: string) => {
    const user = authService.login(email, password, users);

    if (user) {
      setCurrentUser(user);
      setCurrentPage("dashboard");
      toast.success("Login successful!");
    } else {
      toast.error("Invalid credentials or account not verified");
    }
  };

  const handleAdminRegister = async (data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }) => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/auth/register/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            companyName: data.companyName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Handle error responses (400, 500, etc.)
        toast.error(result.message || "Registration failed");
        return;
      }

      // Registration successful
      setPendingUser({
        ...data,
        role: "admin",
        verified: false,
        userId: result.data.userId,
        companyId: result.data.companyId,
        companyName: result.data.companyName,
        // Note: OTP is NOT sent in response (security), it's emailed to the user
      });

      setCurrentPage("otp");
      toast.success(
        result.message || "Verification code sent to " + data.email
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  const handleUserRegister = (data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
  }) => {
    // Check if email already exists
    if (authService.emailExists(data.email, users)) {
      toast.error("Email already registered");
      return;
    }

    // Generate OTP
    const otp = authService.generateOTP();

    setPendingUser({
      ...data,
      role: "user",
      verified: false,
      otp,
    });

    setCurrentPage("otp");
    toast.success("Verification code sent to " + data.email);
    console.log("OTP for testing:", otp);
  };

  const handleOTPVerify = async (otp: string) => {
    if (!pendingUser) {
      toast.error("No pending user found");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5050/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: pendingUser.email,
            otp: otp,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Handle different error cases
        toast.error(result.message || "OTP verification failed");
        return;
      }

      // OTP verification successful
      const verifiedUser: User = {
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        companyName: pendingUser.companyName,
        role: pendingUser.role,
        verified: true,
        userId: result.data.userId,
        companyId: pendingUser.companyId,
      };

      setUsers([...users, verifiedUser]);

      // If admin, add company to list
      if (verifiedUser.role === "admin") {
        setCompanies([...companies, verifiedUser.companyName]);
      }

      setCurrentUser(verifiedUser);
      setPendingUser(null);
      setCurrentPage("dashboard");
      toast.success(result.message || "Account verified successfully!");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Network error. Please check your connection and try again.");
    }
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("auth");
    toast.success("Logged out successfully");
  };

  return (
    <div>
      <Toaster />

      {currentPage === "auth" && (
        <AuthPage
          onLogin={handleLogin}
          onSwitchToAdminRegister={() => setCurrentPage("admin-register")}
          onSwitchToUserRegister={() => setCurrentPage("user-register")}
        />
      )}

      {currentPage === "admin-register" && (
        <AdminRegistration
          onRegister={handleAdminRegister}
          onBack={() => setCurrentPage("auth")}
        />
      )}

      {currentPage === "user-register" && (
        <UserRegistration
          onRegister={handleUserRegister}
          onBack={() => setCurrentPage("auth")}
          companies={companies}
        />
      )}

      {currentPage === "otp" && pendingUser && (
        <OTPVerification email={pendingUser.email} onVerify={handleOTPVerify} />
      )}

      {currentPage === "dashboard" && currentUser && (
        <>
          {currentUser.role === "admin" ? (
            <AdminDashboard user={currentUser} onLogout={handleLogout} />
          ) : (
            <UserDashboard
              user={currentUser}
              onLogout={handleLogout}
              companyName={currentUser.companyName}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
