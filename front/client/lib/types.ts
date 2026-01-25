export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'premium' | 'pro';
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  enabledModules: ModuleId[];
}

export type ModuleId =
  | 'core_financial'
  | 'organization_control'
  | 'simulations'
  | 'investments'
  | 'open_finance';

export type UserPlan = 'free' | 'premium' | 'pro';

export interface Module {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  requiredPlan: UserPlan;
  comingSoon: boolean;
  enabled: boolean;
}

export interface UserModuleAccess {
  moduleId: ModuleId;
  accessible: boolean;
  reason?: string;
}