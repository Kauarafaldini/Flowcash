// User Plans
export type UserPlan = "free" | "premium" | "pro";

// User Roles
export type UserRole = "user" | "admin";

// Module Types
export type ModuleId =
  | "core_financial"
  | "organization_control"
  | "simulations"
  | "investments"
  | "open_finance";

// Module Definition
export interface Module {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  requiredPlan: UserPlan;
  comingSoon: boolean;
  enabled: boolean; // Global enable/disable by admin
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  enabledModules: ModuleId[]; // User-specific module access
}

// Subscription/Plan Info
export interface UserSubscription {
  userId: string;
  plan: UserPlan;
  startDate: string;
  renewalDate?: string;
  active: boolean;
}

// Module Status for User
export interface UserModuleAccess {
  moduleId: ModuleId;
  accessible: boolean; // Can user access this module
  reason?: string; // Why they can't access (e.g., "upgrade_required", "coming_soon")
}

// Admin Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  usersByPlan: {
    free: number;
    premium: number;
    pro: number;
  };
  monthlyGrowth: number;
  totalRevenue?: number;
}

// Audit Log
export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  targetUserId?: string;
  changes: Record<string, any>;
  timestamp: string;
}
