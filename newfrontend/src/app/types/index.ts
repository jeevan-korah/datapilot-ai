// User and Authentication Types
export interface User {
  name: string;
  email: string;
  password: string;
  companyName: string;
  userType?: string;
  role: string;

  roles?: Array<{ id: string; name: string }>;
  verified: boolean;
  userId?: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface PendingUser extends User {
  otp?: string;
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

// Role Types
export interface Role {
  id: string;
  name: string;
  permissions: Record<string, boolean>; // table name -> access
}

// Query Types
export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  visualization?: {
    type: "table" | "bar" | "line" | "pie";
    data: any[];
  };
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
}

// Page Props Types
export type Page =
  | "auth"
  | "admin-register"
  | "user-register"
  | "otp"
  | "dashboard";
